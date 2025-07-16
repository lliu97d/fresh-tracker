import React, { useState, useRef } from 'react';
import { ScrollView, View, Modal, Pressable, PanResponder, Animated, Dimensions, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Text, YStack, XStack, Button, Card } from 'tamagui';
import AddItemFAB from '../components/AddItemFAB';
import ItemCard, { FreshnessStatus } from '../components/ItemCard';
import PantryCard from '../components/PantryCard';
import HeaderBar from '../components/HeaderBar';
import EmptyState from '../components/EmptyState';
import UnlockBanner from '../components/UnlockBanner';
import { useStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import ManualEntryScreen from './ManualEntryScreen';
import { Ionicons } from '@expo/vector-icons';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Sample food items to showcase the app for unauthenticated users
const sampleFreshItems = [
  {
    id: '1',
    name: 'Organic Bananas',
    quantity: 6,
    originalQuantity: 6,
    unit: 'pcs',
    category: 'Fruits',
    status: 'fresh' as const,
    expiresInDays: 5,
    calories: 89,
    expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Fresh Spinach',
    quantity: 200,
    originalQuantity: 200,
    unit: 'g',
    category: 'Vegetables',
    status: 'watch' as const,
    expiresInDays: 2,
    calories: 23,
    expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    quantity: 500,
    originalQuantity: 500,
    unit: 'ml',
    category: 'Dairy',
    status: 'expiring' as const,
    expiresInDays: 1,
    calories: 59,
    expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
];

const samplePantryItems = [
  {
    id: '4',
    name: 'Quinoa',
    quantity: 500,
    originalQuantity: 500,
    unit: 'g',
    category: 'Pantry',
    status: 'fresh' as const,
    expiresInDays: 365,
    calories: 120,
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    name: 'Olive Oil',
    quantity: 250,
    originalQuantity: 250,
    unit: 'ml',
    category: 'Oils',
    status: 'fresh' as const,
    expiresInDays: 730,
    calories: 884,
    expirationDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'fresh': return '#388E3C';
    case 'watch': return '#E65100';
    case 'expiring': return '#B71C1C';
    case 'expired': return '#666666';
    default: return '#388E3C';
  }
};

const getStatusBackground = (status: string) => {
  switch (status) {
    case 'fresh': return '#E8F5E8';
    case 'watch': return '#FFF3E0';
    case 'expiring': return '#FFEBEE';
    case 'expired': return '#F5F5F5';
    default: return '#E8F5E8';
  }
};

const SampleFoodCard = ({ item }: { item: any }) => (
  <Card
    backgroundColor="#FFF"
    borderRadius={16}
    padding={16}
    marginBottom={12}
    elevation={2}
    shadowOpacity={0.08}
    borderWidth={1}
    borderColor="#F0F0F0"
  >
    <XStack justifyContent="space-between" alignItems="flex-start" marginBottom={8}>
      <YStack flex={1}>
        <Text fontSize={18} fontWeight="600" color="#222" marginBottom={4}>
          {item.name}
        </Text>
        <Text fontSize={14} color="#666" marginBottom={4}>
          {item.quantity} {item.unit} • {item.category}
        </Text>
        <Text fontSize={14} color="#666">
          {item.calories} calories per 100g
        </Text>
      </YStack>
      <View style={{
        backgroundColor: getStatusBackground(item.status),
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: getStatusColor(item.status) + '20',
      }}>
        <Text fontSize={12} fontWeight="600" color={getStatusColor(item.status)}>
          {item.status === 'fresh' ? 'Fresh' :
           item.status === 'watch' ? 'Watch' :
           item.status === 'expiring' ? 'Expiring' :
           'Expired'}
        </Text>
      </View>
    </XStack>
    
    <XStack alignItems="center" space={8}>
      <Ionicons 
        name={item.expiresInDays <= 1 ? "warning" : "time"} 
        size={16} 
        color={item.expiresInDays <= 1 ? "#B71C1C" : "#666"} 
      />
      <Text fontSize={14} color={item.expiresInDays <= 1 ? "#B71C1C" : "#666"}>
        {item.expiresInDays <= 1 
          ? `Expires today!` 
          : `Expires in ${item.expiresInDays} days`
        }
      </Text>
    </XStack>
  </Card>
);

interface FoodScreenProps {
  onLoginPress?: () => void;
  onSignUpPress?: () => void;
}

export default function FoodScreen({ navigation, onLoginPress, onSignUpPress }: FoodScreenProps & any) {
  const { foodItems, getFoodItemsByLocation, deleteFoodItem, updateFoodItem, userProfile } = useStore();
  const { user, isAuthenticated } = useAuth();
  const [selected, setSelected] = useState<'fresh' | 'pantry'>('fresh');
  const [statusFilter, setStatusFilter] = useState<FreshnessStatus | null>(null);
  const screenHeight = Dimensions.get('window').height;
  const [modalVisible, setModalVisible] = useState(false);
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const overlayOpacity = panY.interpolate({
    inputRange: [0, screenHeight],
    outputRange: [0.18, 0],
    extrapolate: 'clamp',
  });
  const [blurAmount, setBlurAmount] = useState(0);

  // Slide up animation logic
  React.useEffect(() => {
    if (modalVisible) {
      panY.setValue(screenHeight);
      Animated.timing(panY, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start();
    } else {
      panY.setValue(screenHeight);
    }
  }, [modalVisible]);

  const closeModal = () => {
    Animated.timing(panY, {
      toValue: screenHeight,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 8,
      onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80) {
          closeModal();
        } else {
          Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;
  
  // Use sample data for unauthenticated users, real data for authenticated users
  const freshItems = isAuthenticated ? getFoodItemsByLocation('fresh') : sampleFreshItems;
  const pantryItems = isAuthenticated ? getFoodItemsByLocation('pantry') : samplePantryItems;
  
  // Filter items based on status filter
  const filteredFreshItems = statusFilter 
    ? freshItems.filter(item => item.status === statusFilter)
    : freshItems;

  const handleStatusFilter = (status: FreshnessStatus) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  const handleDeleteItem = (id: string) => {
    deleteFoodItem(id);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    // Find the item and update its quantity
    const item = foodItems.find(item => item.id === id);
    if (item) {
      updateFoodItem(id, { quantity: newQuantity });
    }
  };

  const clearFilter = () => {
    setStatusFilter(null);
  };

  // Get user display name for greeting
  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (userProfile?.name) return userProfile.name;
    if (user?.email) return user.email.split('@')[0];
    return 'there';
  };

  // Check if this is a new user (no food items yet)
  const isNewUser = freshItems.length === 0 && pantryItems.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7FB' }}>
      {/* Modern Header with Dynamic Greeting and Tabs */}
      <View
        style={{
          backgroundColor: '#F6F7FB',
          paddingTop: 36,
          paddingBottom: 10,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          alignItems: 'flex-start',
        }}
      >
        <Text fontSize={26} fontWeight="700" color="#222" style={{ marginBottom: 8 }}>
          {getGreeting()}, {isAuthenticated ? getUserDisplayName() : 'Food Lover'}!
        </Text>
        <Text fontSize={18} fontWeight="400" color="#666" style={{ marginBottom: 18 }}>
          {!isAuthenticated 
            ? "Discover how FreshTracker can transform your food management"
            : isNewUser 
              ? "Welcome to FreshTracker! Let's start by adding your first food item."
              : "Today is going to be a good day."
          }
        </Text>
        {/* Tabs for Fresh Items and Pantry, with Add button */}
        <XStack space={10} alignItems="center">
          <Button
            backgroundColor={selected === 'fresh' ? '#E8F5E8' : '#F3F4F6'}
            borderRadius={20}
            paddingHorizontal={18}
            paddingVertical={8}
            elevation={selected === 'fresh' ? 2 : 1}
            shadowOpacity={selected === 'fresh' ? 0.08 : 0.04}
            borderWidth={0}
            onPress={() => setSelected('fresh')}
            pressStyle={{ backgroundColor: '#E8F5E8' }}
          >
            <Text fontSize={16} color={selected === 'fresh' ? '#388E3C' : '#222'} fontWeight={selected === 'fresh' ? '600' : '500'}>
              Fresh Items
            </Text>
          </Button>
          <Button
            backgroundColor={selected === 'pantry' ? '#FFF8E1' : '#F3F4F6'}
            borderRadius={20}
            paddingHorizontal={18}
            paddingVertical={8}
            elevation={selected === 'pantry' ? 2 : 1}
            shadowOpacity={selected === 'pantry' ? 0.10 : 0.04}
            borderWidth={0}
            onPress={() => setSelected('pantry')}
            pressStyle={{ backgroundColor: '#FFF8E1' }}
          >
            <Text fontSize={16} color={selected === 'pantry' ? '#7B4F19' : '#222'} fontWeight={selected === 'pantry' ? '700' : '500'}>
              Pantry
            </Text>
          </Button>
          {isAuthenticated && (
            <Button
              backgroundColor="#388E3C"
              borderRadius={20}
              paddingHorizontal={18}
              paddingVertical={8}
              elevation={2}
              shadowOpacity={0.08}
              borderWidth={0}
              marginLeft={8}
              onPress={() => setModalVisible(true)}
              pressStyle={{ backgroundColor: '#256029' }}
            >
              <Text fontSize={16} color="#FFF" fontWeight="600">+ Add</Text>
            </Button>
          )}
        </XStack>
      </View>

      {/* Unlock Banner for Unauthenticated Users */}
      {!isAuthenticated && (
        <UnlockBanner
          onLoginPress={onLoginPress}
          onSignUpPress={onSignUpPress}
        />
      )}

      {/* Minimal Borderless Filter Bar with Counts, Horizontally Scrollable */}
      <YStack marginTop={4} marginBottom={8}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <XStack space="$2" alignItems="center" justifyContent="center">
            {[
              {
                label: 'Fresh', value: 'fresh',
                selectedBg: '#E8F5E8', selectedText: '#388E3C',
                unselectedBg: '#F3F4F6', unselectedText: '#222',
                count: freshItems.filter(item => item.status === 'fresh').length,
              },
              {
                label: 'Watch', value: 'watch',
                selectedBg: '#FFF3E0', selectedText: '#E65100',
                unselectedBg: '#F3F4F6', unselectedText: '#222',
                count: freshItems.filter(item => item.status === 'watch').length,
              },
              {
                label: 'Expiring', value: 'expiring',
                selectedBg: '#FFEBEE', selectedText: '#B71C1C',
                unselectedBg: '#F3F4F6', unselectedText: '#222',
                count: freshItems.filter(item => item.status === 'expiring').length,
              },
              {
                label: 'Expired', value: 'expired',
                selectedBg: '#E0E0E0', selectedText: '#222',
                unselectedBg: '#F3F4F6', unselectedText: '#222',
                count: freshItems.filter(item => item.status === 'expired').length,
              },
            ].map(({ label, value, selectedBg, selectedText, unselectedBg, unselectedText, count }) => {
              const isSelected = statusFilter === value;
              return (
                <Button
                  key={value}
                  size="$2"
                  borderRadius={20}
                  backgroundColor={isSelected ? selectedBg : unselectedBg}
                  borderWidth={0}
                  paddingHorizontal={16}
                  paddingVertical={4}
                  minWidth={0}
                  elevation={isSelected ? 2 : 1}
                  shadowOpacity={isSelected ? 0.08 : 0.04}
                  onPress={() => handleStatusFilter(value as FreshnessStatus)}
                  pressStyle={{ backgroundColor: selectedBg }}
                >
                  <XStack alignItems="center" space={6}>
                    <Text
                      fontSize={14}
                      color={isSelected ? selectedText : unselectedText}
                      fontWeight={isSelected ? '600' : '500'}
                    >
                      {label}
                    </Text>
                    <Text
                      fontSize={13}
                      color={isSelected ? selectedText : unselectedText}
                      fontWeight="500"
                      marginLeft={4}
                    >
                      {count}
                    </Text>
                  </XStack>
                </Button>
              );
            })}
          </XStack>
        </ScrollView>
      </YStack>

      {/* Welcome Banner for New Users */}
      {isNewUser && (
        <Card
          backgroundColor="#E8F5E8"
          borderRadius={16}
          marginHorizontal={20}
          marginBottom={16}
          padding={16}
          elevation={2}
          shadowOpacity={0.08}
        >
          <XStack alignItems="center" space={12}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: '#388E3C',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text fontSize={24} color="#FFF">🍎</Text>
            </View>
            <YStack flex={1}>
              <Text fontSize={16} fontWeight="600" color="#388E3C" marginBottom={4}>
                Welcome to FreshTracker!
              </Text>
              <Text fontSize={14} color="#2E7D32" lineHeight={20}>
                Start tracking your food by adding your first item. You can scan barcodes or enter items manually.
              </Text>
            </YStack>
          </XStack>
        </Card>
      )}

      {/* Content */}
      {selected === 'fresh' ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}>
          <YStack space="$4">
            {/* Food Items */}
            <YStack space="$3">
              {filteredFreshItems.length > 0 ? (
                filteredFreshItems.map((item) => (
                  isAuthenticated ? (
                    <ItemCard 
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      quantity={item.quantity}
                      originalQuantity={item.originalQuantity}
                      unit={item.unit}
                      category={item.category}
                      calories={`${item.calories || 0} per 100g`}
                      expiresInDays={Math.ceil((item.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                      status={item.status}
                      onViewRecipes={() => {}}
                      onUpdateQty={handleUpdateQuantity}
                      onDelete={handleDeleteItem}
                    />
                  ) : (
                    <SampleFoodCard key={item.id} item={item} />
                  )
                ))
              ) : (
                <EmptyState
                  title={statusFilter ? `No ${statusFilter === 'expired' ? 'Expired' :
                                       statusFilter === 'expiring' ? 'Expiring' : 
                                       statusFilter === 'watch' ? 'Watch' : 'Fresh'} Items` : "No Fresh Items"}
                  message={statusFilter ? 
                    `You don't have any items that are ${statusFilter === 'expired' ? 'expired' :
                     statusFilter === 'expiring' ? 'expiring soon' : 
                     statusFilter === 'watch' ? 'needing attention' : 'fresh and good'}.` :
                    "Your fresh food inventory is empty. Use the + button below to add items by scanning barcodes or manual entry."
                  }
                  variant={statusFilter || 'fresh'}
            />
              )}
            </YStack>
          </YStack>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}>
          <YStack space="$4">
            <YStack space="$3">
              {pantryItems.length > 0 ? (
                pantryItems.map((item) => (
                  isAuthenticated ? (
                    <PantryCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      quantity={item.quantity}
                      originalQuantity={item.originalQuantity}
                      unit={item.unit}
                      category={item.category}
                      calories={`${item.calories || 0} per 100g`}
                      expiresInDays={Math.ceil((item.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                      status={item.status}
                      onViewRecipes={() => {}}
                      onUpdateQty={handleUpdateQuantity}
                      onDelete={handleDeleteItem}
                    />
                  ) : (
                    <SampleFoodCard key={item.id} item={item} />
                  )
                ))
              ) : (
                <EmptyState
                  title="No Pantry Items"
                  message="Your pantry is empty. Use the + button below to add non-perishable items to your inventory."
                  variant="pantry"
                />
              )}
            </YStack>
          </YStack>
        </ScrollView>
      )}

      {/* Manual Entry Modal Overlay */}
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent
        onRequestClose={closeModal}
      >
        <Animated.View
          style={{ flex: 1, backgroundColor: overlayOpacity.interpolate({inputRange: [0, 0.18], outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.18)']}) }}
          pointerEvents="box-none"
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={closeModal}
            pointerEvents="auto"
          >
            <Animated.View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '80%',
                backgroundColor: '#fff',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                shadowColor: '#000',
                shadowOpacity: 0.10,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: -4 },
                elevation: 12,
                overflow: 'hidden',
                transform: [{ translateY: panY }],
              }}
              onStartShouldSetResponder={() => true}
              onResponderStart={e => e.stopPropagation()}
            >
              <View
                style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 2 }}
                {...panResponder.panHandlers}
              >
                <View style={{ width: 48, height: 5, borderRadius: 3, backgroundColor: '#E0E0E0', marginBottom: 8 }} />
              </View>
              <ManualEntryScreen
                navigation={{
                  ...navigation,
                  goBack: closeModal,
                }}
                onRequestClose={closeModal}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Modal>
    </View>
  );
}

// Add styles at the end of the file
const styles = StyleSheet.create({
  greetingBackground: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 0,
    overflow: 'hidden',
  },
  greetingTextContainer: {
    marginTop: 25,
    marginLeft: 20,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  greetingTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#222',
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  greetingSubtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#444',
    opacity: 0.92,
    marginBottom: 0,
    letterSpacing: 0.1,
  },
  tabsFilterCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    width: '100%',
    marginTop: 0,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});