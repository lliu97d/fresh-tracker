import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, YStack, XStack, Button, Card, Stack } from 'tamagui';
import { AlertTriangle, CheckCircle, Clock } from '@tamagui/lucide-icons';
import AddItemFAB from '../components/AddItemFAB';
import ItemCard, { FreshnessStatus } from '../components/ItemCard';
import HeaderBar from '../components/HeaderBar';
import EmptyState from '../components/EmptyState';
import { useStore } from '../store';

export default function FoodScreen({ navigation }: any) {
  const { foodItems, getFoodItemsByLocation, deleteFoodItem, updateFoodItem } = useStore();
  const [selected, setSelected] = useState<'fresh' | 'pantry'>('fresh');
  const [statusFilter, setStatusFilter] = useState<FreshnessStatus | null>(null);
  
  const freshItems = getFoodItemsByLocation('fresh');
  const pantryItems = getFoodItemsByLocation('pantry');
  
  const summary = freshItems.reduce(
    (acc, item) => {
      acc[item.status]++;
      return acc;
    },
    { fresh: 0, watch: 0, expiring: 0, expired: 0 }
  );

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
    <View style={{ flex: 1 }}>
      <HeaderBar title="Food" />
      
      {/* Segmented Control */}
      <YStack paddingHorizontal="$5" paddingTop="$4" paddingBottom="$3">
        <Card
          backgroundColor="$gray3"
          borderRadius="$4"
          padding="$1"
          borderColor="$gray6"
          borderWidth={1}
        >
          <XStack>
            <Button
              flex={1}
              size="$3"
              backgroundColor={selected === 'fresh' ? '$primary' : 'transparent'}
              color={selected === 'fresh' ? 'white' : '$gray11'}
              fontWeight={selected === 'fresh' ? 'bold' : '500'}
              borderRadius="$3"
              onPress={() => setSelected('fresh')}
              pressStyle={{ backgroundColor: selected === 'fresh' ? '$primary' : '$gray4' }}
            >
              Fresh Foods
            </Button>
            <Button
              flex={1}
              size="$3"
              backgroundColor={selected === 'pantry' ? '$primary' : 'transparent'}
              color={selected === 'pantry' ? 'white' : '$gray11'}
              fontWeight={selected === 'pantry' ? 'bold' : '500'}
              borderRadius="$3"
              onPress={() => setSelected('pantry')}
              pressStyle={{ backgroundColor: selected === 'pantry' ? '$primary' : '$gray4' }}
            >
              Pantry
            </Button>
          </XStack>
        </Card>
      </YStack>

      {/* Content */}
      {selected === 'fresh' ? (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <YStack space="$4">
            <Text fontSize="$7" fontWeight="bold" color="$color">
              Fresh Items
            </Text>
            
            {/* Summary Cards */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            >
              <XStack space="$3" paddingHorizontal="$5">
                <Card
                  backgroundColor={statusFilter === 'fresh' ? '#E8F5E8' : '#F1F8E9'}
                  borderColor={statusFilter === 'fresh' ? '#81C784' : '#C8E6C9'}
                  borderWidth={statusFilter === 'fresh' ? 2 : 1}
                  borderRadius="$4"
                  padding="$3"
                  alignItems="center"
                  onPress={() => handleStatusFilter('fresh')}
                  pressStyle={{ backgroundColor: '#E8F5E8' }}
                  minWidth={100}
                >
                  <CheckCircle size={20} color="#81C784" marginBottom="$2" />
                  <Text fontSize="$6" fontWeight="bold" color="#212121">
                    {summary.fresh}
                  </Text>
                  <Text fontSize="$2" color="#424242" textAlign="center">
                    Fresh & Good
                  </Text>
                </Card>

                <Card
                  backgroundColor={statusFilter === 'watch' ? '#FFF3E0' : '#FFF8E1'}
                  borderColor={statusFilter === 'watch' ? '#FFB74D' : '#FFCC80'}
                  borderWidth={statusFilter === 'watch' ? 2 : 1}
                  borderRadius="$4"
                  padding="$3"
                  alignItems="center"
                  onPress={() => handleStatusFilter('watch')}
                  pressStyle={{ backgroundColor: '#FFF3E0' }}
                  minWidth={100}
                >
                  <Clock size={20} color="#FFB74D" marginBottom="$2" />
                  <Text fontSize="$6" fontWeight="bold" color="#212121">
                    {summary.watch}
                  </Text>
                  <Text fontSize="$2" color="#424242" textAlign="center">
                    Watch Closely
                  </Text>
                </Card>
                
                <Card
                  backgroundColor={statusFilter === 'expiring' ? '#FFEBEE' : '#FFF5F5'}
                  borderColor={statusFilter === 'expiring' ? '#EF5350' : '#FFCDD2'}
                  borderWidth={statusFilter === 'expiring' ? 2 : 1}
                  borderRadius="$4"
                  padding="$3"
                  alignItems="center"
                  onPress={() => handleStatusFilter('expiring')}
                  pressStyle={{ backgroundColor: '#FFEBEE' }}
                  minWidth={100}
                >
                  <AlertTriangle size={20} color="#EF5350" marginBottom="$2" />
                  <Text fontSize="$6" fontWeight="bold" color="#212121">
                    {summary.expiring}
                  </Text>
                  <Text fontSize="$2" color="#424242" textAlign="center">
                    Expiring Soon
                  </Text>
                </Card>
                
                <Card
                  backgroundColor={statusFilter === 'expired' ? '#F5F5F5' : '#FAFAFA'}
                  borderColor={statusFilter === 'expired' ? '#9E9E9E' : '#E0E0E0'}
                  borderWidth={statusFilter === 'expired' ? 2 : 1}
                  borderRadius="$4"
                  padding="$3"
                  alignItems="center"
                  onPress={() => handleStatusFilter('expired')}
                  pressStyle={{ backgroundColor: '#F5F5F5' }}
                  minWidth={100}
                >
                  <AlertTriangle size={20} color="#9E9E9E" marginBottom="$2" />
                  <Text fontSize="$6" fontWeight="bold" color="#212121">
                    {summary.expired}
                  </Text>
                  <Text fontSize="$2" color="#424242" textAlign="center">
                    Expired
                  </Text>
                </Card>
              </XStack>
            </ScrollView>

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
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          <YStack space="$4">
            <Text fontSize="$7" fontWeight="bold" color="$color">
              Pantry & Seasonings
            </Text>
            
            <YStack space="$3">
              {pantryItems.length > 0 ? (
                pantryItems.map((item) => (
                  <Card
                    key={item.id}
                    backgroundColor="$gray2"
                    borderColor="$gray6"
                    borderWidth={1}
                    borderRadius="$4"
                    padding="$4"
                    marginBottom="$3"
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                      <Text fontSize="$5" fontWeight="bold" color="$color">
                        {item.name}
                      </Text>
                      <Text fontSize="$3" color="$gray10">
                        Expires {item.expirationDate.toLocaleDateString()}
                      </Text>
                    </XStack>
                    <Text fontSize="$4" color="$gray11">
                      {item.quantity} {item.unit} • {item.category}
                    </Text>
                  </Card>
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
      
      <AddItemFAB
        onScanBarcode={() => navigation.navigate('BarcodeScanner')}
        onManualEntry={() => navigation.navigate('ManualEntry')}
      />
    </View>
  );
} 