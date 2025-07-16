import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, YStack, XStack, Button, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Sample food items to showcase the app
const sampleFreshItems = [
  {
    id: '1',
    name: 'Organic Bananas',
    quantity: 6,
    unit: 'pcs',
    category: 'Fruits',
    status: 'fresh' as const,
    expiresInDays: 5,
    calories: 89,
  },
  {
    id: '2',
    name: 'Fresh Spinach',
    quantity: 200,
    unit: 'g',
    category: 'Vegetables',
    status: 'watch' as const,
    expiresInDays: 2,
    calories: 23,
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    quantity: 500,
    unit: 'ml',
    category: 'Dairy',
    status: 'expiring' as const,
    expiresInDays: 1,
    calories: 59,
  },
];

const samplePantryItems = [
  {
    id: '4',
    name: 'Quinoa',
    quantity: 500,
    unit: 'g',
    category: 'Pantry',
    status: 'fresh' as const,
    expiresInDays: 365,
    calories: 120,
  },
  {
    id: '5',
    name: 'Olive Oil',
    quantity: 250,
    unit: 'ml',
    category: 'Oils',
    status: 'fresh' as const,
    expiresInDays: 730,
    calories: 884,
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

interface SampleFoodScreenProps {
  onLoginPress: () => void;
  onSignUpPress: () => void;
}

export default function SampleFoodScreen({ onLoginPress, onSignUpPress }: SampleFoodScreenProps) {
  const [selected, setSelected] = React.useState<'fresh' | 'pantry'>('fresh');

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7FB' }}>
      {/* Header with Greeting and Tabs */}
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
          {getGreeting()}, Food Lover!
        </Text>
        <Text fontSize={18} fontWeight="400" color="#666" style={{ marginBottom: 18 }}>
          Discover how FreshTracker can transform your food management
        </Text>
        
        {/* Tabs */}
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
        </XStack>
      </View>

      {/* Login Prompt Banner */}
      <Card
        backgroundColor="#E3F2FD"
        borderRadius={16}
        marginHorizontal={20}
        marginTop={16}
        marginBottom={16}
        padding={16}
        elevation={2}
        shadowOpacity={0.08}
        borderWidth={1}
        borderColor="#2196F3"
      >
        <XStack alignItems="center" space={12}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#2196F3',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Ionicons name="leaf" size={24} color="#FFF" />
          </View>
          <YStack flex={1}>
            <Text fontSize={16} fontWeight="600" color="#1976D2" marginBottom={4}>
              Unlock Your Food Journey
            </Text>
            <Text fontSize={14} color="#1565C0" lineHeight={20} marginBottom={12}>
              Sign in to track your own food items, get personalized recipes, and never waste food again!
            </Text>
            <XStack space={8}>
              <Button
                backgroundColor="#2196F3"
                borderRadius={12}
                paddingHorizontal={16}
                paddingVertical={8}
                onPress={onLoginPress}
                flex={1}
              >
                <Text fontSize={14} color="#FFF" fontWeight="600">Sign In</Text>
              </Button>
              <Button
                backgroundColor="#4CAF50"
                borderRadius={12}
                paddingHorizontal={16}
                paddingVertical={8}
                onPress={onSignUpPress}
                flex={1}
              >
                <Text fontSize={14} color="#FFF" fontWeight="600">Sign Up</Text>
              </Button>
            </XStack>
          </YStack>
        </XStack>
      </Card>

      {/* Filter Bar */}
      <YStack marginTop={4} marginBottom={8}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          <XStack space="$2" alignItems="center" justifyContent="center">
            {[
              { label: 'Fresh', count: 1, color: '#388E3C' },
              { label: 'Watch', count: 1, color: '#E65100' },
              { label: 'Expiring', count: 1, color: '#B71C1C' },
              { label: 'Expired', count: 0, color: '#666666' },
            ].map(({ label, count, color }) => (
              <View
                key={label}
                style={{
                  backgroundColor: '#F3F4F6',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                  marginRight: 8,
                }}
              >
                <XStack alignItems="center" space={6}>
                  <Text fontSize={14} color="#222" fontWeight="500">
                    {label}
                  </Text>
                  <Text fontSize={13} color="#666" fontWeight="500">
                    {count}
                  </Text>
                </XStack>
              </View>
            ))}
          </XStack>
        </ScrollView>
      </YStack>

      {/* Sample Content */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}>
        <YStack space="$4">
          <Text fontSize={20} fontWeight="600" color="#222" marginBottom={8}>
            {selected === 'fresh' ? 'Sample Fresh Items' : 'Sample Pantry Items'}
          </Text>
          
          <YStack space="$3">
            {(selected === 'fresh' ? sampleFreshItems : samplePantryItems).map((item) => (
              <SampleFoodCard key={item.id} item={item} />
            ))}
          </YStack>

          {/* Features Preview */}
          <Card
            backgroundColor="#F8F9FA"
            borderRadius={16}
            padding={20}
            marginTop={16}
            borderWidth={1}
            borderColor="#E9ECEF"
          >
            <Text fontSize={18} fontWeight="600" color="#222" marginBottom={12}>
              🚀 What You'll Get
            </Text>
            <YStack space={8}>
              <XStack alignItems="center" space={8}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text fontSize={14} color="#666">Track expiration dates automatically</Text>
              </XStack>
              <XStack alignItems="center" space={8}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text fontSize={14} color="#666">Get personalized recipe suggestions</Text>
              </XStack>
              <XStack alignItems="center" space={8}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text fontSize={14} color="#666">Scan barcodes for instant food info</Text>
              </XStack>
              <XStack alignItems="center" space={8}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text fontSize={14} color="#666">Reduce food waste and save money</Text>
              </XStack>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </View>
  );
} 