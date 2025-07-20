import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FoodScreen from '../screens/FreshFoodsScreen';
import RecipesScreen from '../screens/RecipesScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import ManualEntryScreen from '../screens/ManualEntryScreen';
import { Ionicons } from '@expo/vector-icons';
import { Home, BookOpen, User } from '@tamagui/lucide-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FoodStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FoodMain" 
        component={FoodScreen}
        options={{ title: 'Food', headerShown: false }}
      />
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

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile', headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      initialRouteName="Food"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Use lucide-icons for a modern look
          if (route.name === 'Food') {
            return <Home size={26} color={focused ? '#388E3C' : '#B0B0B0'} style={{ marginBottom: 2 }} />;
          } else if (route.name === 'Recipes') {
            return <BookOpen size={26} color={focused ? '#388E3C' : '#B0B0B0'} style={{ marginBottom: 2 }} />;
          } else if (route.name === 'Profile') {
            return <User size={26} color={focused ? '#388E3C' : '#B0B0B0'} style={{ marginBottom: 2 }} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#388E3C',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          height: Platform.OS === 'ios' ? 72 + insets.bottom : 72,
          paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 18) : 18,
          paddingTop: 10,
          // Remove floating effect:
          position: 'relative',
          marginHorizontal: 0,
          marginBottom: 0,
          borderRadius: 0,
          left: 0,
          right: 0,
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: { width: 0, height: 0 },
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
          marginTop: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Food" 
        component={FoodStack}
        options={{ 
          headerShown: false,
          tabBarLabel: 'Home',
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
        component={ProfileStack}
        options={{ 
          headerShown: false,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
} 