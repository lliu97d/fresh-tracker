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
import { useStore } from '../store';
import ManualEntryScreen from './ManualEntryScreen';
import HomeIllustration from '../assets/home-illustration-1.png';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function FoodScreen({ navigation }: any) {
  const { foodItems, getFoodItemsByLocation, deleteFoodItem, updateFoodItem, userProfile } = useStore();
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
  
  const freshItems = getFoodItemsByLocation('fresh');
  const pantryItems = getFoodItemsByLocation('pantry');
  
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

  const screenWidth = Dimensions.get('window').width;
  const illustrationAspectRatio = 1021 / 889;
  const illustrationHeight = screenWidth / illustrationAspectRatio;
  const GREETING_HEIGHT = 70; // px, adjust to match greeting text height
  const ILLUSTRATION_HEIGHT = illustrationHeight;
  const HEADER_HEIGHT = GREETING_HEIGHT + ILLUSTRATION_HEIGHT;

  // Animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        // Calculate blur based on scroll position
        const max = ILLUSTRATION_HEIGHT;
        const blur = Math.max(0, Math.min(40, (y / max) * 40));
        setBlurAmount(blur);
      },
    }
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      {/* Gradient background from bottom of illustration to bottom of screen */}
      <LinearGradient
        colors={["#c2e082", "#F6F7FB"]} // Adjust #B6D98A to match the bottom color of your illustration
        style={{ position: 'absolute', left: 0, right: 0, top: ILLUSTRATION_HEIGHT, bottom: 0, zIndex: -1 }}
      />
      {/* Illustration + Greeting Text Background (absolute) */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT, zIndex: 0 }} pointerEvents="none">
        <ImageBackground
          source={HomeIllustration}
          style={{ width: screenWidth, height: ILLUSTRATION_HEIGHT }}
          imageStyle={{ resizeMode: 'contain', alignSelf: 'center' }}
        >
          <View style={[styles.greetingTextContainer, { position: 'absolute', top: 0, left: 0, right: 0, height: GREETING_HEIGHT, justifyContent: 'flex-end', backgroundColor: 'transparent', zIndex: 1 }]}> 
            <Text style={styles.greetingTitle}>
              {getGreeting()}{userProfile?.name ? `, ${userProfile.name}` : ''}
            </Text>
            <Text style={styles.greetingSubtitle}>
              Today is going to be a good day.
            </Text>
          </View>
          <View style={{ ...StyleSheet.absoluteFillObject, opacity: blurAmount > 0 ? 1 : 0, zIndex: 2 }}>
            <BlurView intensity={blurAmount} style={StyleSheet.absoluteFill} tint="light" />
          </View>
        </ImageBackground>
      </View>

      {/* Foreground Layer (scrollable, stops at greeting text) */}
      <Animated.ScrollView
        style={{ flex: 1, zIndex: 1 }}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          paddingBottom: 100,
          minHeight: Dimensions.get('window').height + HEADER_HEIGHT,
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        stickyHeaderIndices={[0]}
      >
        {/* Tabs and Filter Bar in unified card */}
        <View style={styles.tabsFilterCard}>
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
          </XStack>
          <YStack marginTop={8}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 0 }}>
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
        </View>

        {/* Content */}
        {selected === 'fresh' ? (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}>
            <YStack space="$4">

              {/* Food Items */}
              <YStack space="$3">
                {filteredFreshItems.length > 0 ? (
                  filteredFreshItems.map((item) => (
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
      {/* End Foreground Layer */}
      </Animated.ScrollView>

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