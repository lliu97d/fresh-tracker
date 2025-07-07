import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FoodScreen from '../screens/FreshFoodsScreen';
import RecipesScreen from '../screens/RecipesScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import ManualEntryScreen from '../screens/ManualEntryScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FoodStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FoodMain" component={FoodScreen} options={{ title: 'Food', headerShown: false }} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} options={{ title: 'Scan Barcode' }} />
      <Stack.Screen name="ManualEntry" component={ManualEntryScreen} options={{ title: 'Manual Entry' }} />
    </Stack.Navigator>
  );
}

function RecipesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RecipesMain" component={RecipesScreen} options={{ title: 'Recipes', headerShown: false }} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'nutrition';
          if (route.name === 'Food') {
            iconName = 'nutrition';
          } else if (route.name === 'Recipes') {
            iconName = 'restaurant';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 8,
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 60,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
      })}
    >
      <Tab.Screen 
        name="Food" 
        component={FoodStack} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Food',
        }} 
      />
      <Tab.Screen 
        name="Recipes" 
        component={RecipesStack} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Recipes',
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          headerShown: false,
          tabBarLabel: 'Profile',
        }} 
      />
    </Tab.Navigator>
  );
} 