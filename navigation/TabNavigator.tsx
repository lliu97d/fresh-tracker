import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FreshFoodsScreen from '../screens/FreshFoodsScreen';
import PantryScreen from '../screens/PantryScreen';
import RecipesScreen from '../screens/RecipesScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import ManualEntryScreen from '../screens/ManualEntryScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FreshFoodsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FreshFoodsMain" component={FreshFoodsScreen} options={{ title: 'Fresh Foods' }} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} options={{ title: 'Scan Barcode' }} />
      <Stack.Screen name="ManualEntry" component={ManualEntryScreen} options={{ title: 'Manual Entry' }} />
    </Stack.Navigator>
  );
}

function PantryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PantryMain" component={PantryScreen} options={{ title: 'Pantry' }} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} options={{ title: 'Scan Barcode' }} />
      <Stack.Screen name="ManualEntry" component={ManualEntryScreen} options={{ title: 'Manual Entry' }} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'nutrition';
          if (route.name === 'Fresh Foods') {
            iconName = 'nutrition';
          } else if (route.name === 'Pantry') {
            iconName = 'cube';
          } else if (route.name === 'Recipes') {
            iconName = 'restaurant';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22c55e', // green
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Fresh Foods" component={FreshFoodsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Pantry" component={PantryStack} options={{ headerShown: false }} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
    </Tab.Navigator>
  );
} 