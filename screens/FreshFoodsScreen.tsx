import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, YStack, XStack, Button, Card } from 'tamagui';
import AddItemFAB from '../components/AddItemFAB';
import ItemCard, { FreshnessStatus } from '../components/ItemCard';
import PantryCard from '../components/PantryCard';
import HeaderBar from '../components/HeaderBar';
import EmptyState from '../components/EmptyState';
import { useStore } from '../store';

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
          {getGreeting()}{userProfile?.name ? `, ${userProfile.name}` : ''}
        </Text>
        <Text fontSize={18} fontWeight="400" color="#666" style={{ marginBottom: 18 }}>
          Today is going to be a good day.
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
          <Button
            backgroundColor="#388E3C"
            borderRadius={20}
            paddingHorizontal={18}
            paddingVertical={8}
            elevation={2}
            shadowOpacity={0.08}
            borderWidth={0}
            marginLeft={8}
            onPress={() => navigation.navigate('ManualEntry')}
            pressStyle={{ backgroundColor: '#256029' }}
          >
            <Text fontSize={16} color="#FFF" fontWeight="600">+ Add</Text>
          </Button>
        </XStack>
      </View>

      {/* Minimal Borderless Filter Bar with Counts, Horizontally Scrollable */}
      <YStack marginTop={4} marginBottom={12}>
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
        <YStack height={1} backgroundColor="#F0F1F2" marginTop={12} />
      </YStack>

      {/* Content */}
      {selected === 'fresh' ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
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
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
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
    </View>
  );
} 