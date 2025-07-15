import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { Ionicons } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import recipeAPI from '../services/recipeAPI';

// Sample recipe data for unauthenticated users
const sampleRecipes = [
  {
    id: '1',
    name: 'Banana Smoothie Bowl',
    title: 'Banana Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400',
    readyInMinutes: 10,
    time: '10 min',
    servings: 2,
    calories: 320,
    cuisine: 'American',
    ingredients: [
      { name: 'Banana', amount: 1, unit: 'piece' },
      { name: 'Greek yogurt', amount: 200, unit: 'g' },
      { name: 'Honey', amount: 15, unit: 'ml' },
      { name: 'Granola', amount: 30, unit: 'g' },
      { name: 'Berries', amount: 50, unit: 'g' },
    ],
    instructions: 'Blend banana with yogurt and honey. Top with granola and fresh berries.',
    tags: ['Breakfast', 'Healthy', 'Quick'],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 8,
    },
  },
  {
    id: '2',
    name: 'Spinach Quinoa Salad',
    title: 'Spinach Quinoa Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    readyInMinutes: 20,
    time: '20 min',
    servings: 4,
    calories: 280,
    cuisine: 'Mediterranean',
    ingredients: [
      { name: 'Quinoa', amount: 100, unit: 'g' },
      { name: 'Fresh spinach', amount: 50, unit: 'g' },
      { name: 'Cherry tomatoes', amount: 100, unit: 'g' },
      { name: 'Cucumber', amount: 1, unit: 'piece' },
      { name: 'Olive oil', amount: 15, unit: 'ml' },
    ],
    instructions: 'Cook quinoa, mix with fresh vegetables, and dress with olive oil and lemon.',
    tags: ['Lunch', 'Vegetarian', 'Protein'],
    nutrition: {
      calories: 280,
      protein: 10,
      carbs: 35,
      fat: 12,
    },
  },
  {
    id: '3',
    name: 'Greek Yogurt Parfait',
    title: 'Greek Yogurt Parfait',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    readyInMinutes: 5,
    time: '5 min',
    servings: 1,
    calories: 250,
    cuisine: 'Greek',
    ingredients: [
      { name: 'Greek yogurt', amount: 150, unit: 'g' },
      { name: 'Honey', amount: 10, unit: 'ml' },
      { name: 'Mixed berries', amount: 50, unit: 'g' },
      { name: 'Nuts', amount: 20, unit: 'g' },
    ],
    instructions: 'Layer yogurt with honey, berries, and nuts for a healthy snack.',
    tags: ['Snack', 'Healthy', 'Quick'],
    nutrition: {
      calories: 250,
      protein: 15,
      carbs: 30,
      fat: 10,
    },
  },
];

export default function RecipesScreen({ navigation }: any) {
  const { 
    recipes, 
    fetchPersonalizedRecipes, 
    searchRecipes, 
    clearRecipes,
    forceReloadRecipes,
    resetRecipes,
    isLoadingRecipes,
    foodItems 
  } = useStore();
  const { isAuthenticated } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load personalized recipes on component mount
  useEffect(() => {
    console.log('🚀 RecipesScreen mounted, loading recipes...');
    forceReloadRecipes();
  }, []);

  const loadPersonalizedRecipes = async () => {
    try {
      await fetchPersonalizedRecipes();
    } catch (error) {
      Alert.alert('Error', 'Failed to load personalized recipes');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setIsSearching(true);
    try {
      await searchRecipes(searchQuery.trim());
      setSearchQuery('');
    } catch (error) {
      Alert.alert('Error', 'Failed to search recipes');
    } finally {
      setIsSearching(false);
    }
  };

  const hasExpiringItems = foodItems.some(item => item.status === 'expiring' || item.status === 'watch');
  
  // Use sample data for unauthenticated users
  const displayRecipes = isAuthenticated ? recipes : sampleRecipes;
  const displayLoading = isAuthenticated ? isLoadingRecipes : false;
  
  // Check API status for authenticated users
  const apiStatus = isAuthenticated ? recipeAPI.getApiStatus() : null;

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar title="Recipes" />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
          disabled={isSearching}
        >
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <View style={styles.actionButtonsContainer}>
          {isAuthenticated && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={forceReloadRecipes}
                disabled={isLoadingRecipes}
              >
                <Ionicons name="refresh" size={20} color="#2563eb" />
                <Text style={styles.actionButtonText}>Refresh</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.clearButton]}
                onPress={() => {
                  clearRecipes();
                  forceReloadRecipes();
                }}
                disabled={isLoadingRecipes}
              >
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
                <Text style={[styles.actionButtonText, styles.clearButtonText]}>Clear</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.resetButton]}
                onPress={async () => {
                  await resetRecipes();
                  forceReloadRecipes();
                }}
                disabled={isLoadingRecipes}
              >
                <Ionicons name="refresh-circle-outline" size={20} color="#059669" />
                <Text style={[styles.actionButtonText, styles.resetButtonText]}>Reset</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Calendar')}
          accessibilityLabel="Open Calendar"
        >
          <Ionicons name="calendar-outline" size={28} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {displayLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                {!isAuthenticated 
                  ? '🍳 Sample recipes to show you what FreshTracker can do!'
                  : hasExpiringItems 
                    ? '🍳 Smart suggestions based on your expiring items and preferences!'
                    : '🍳 Discover delicious recipes tailored to your preferences!'
                }
              </Text>
              {apiStatus && !apiStatus.available && (
                <Text style={[styles.noteText, { color: '#e65100', fontSize: 12, marginTop: 8 }]}>
                  ⚠️ {apiStatus.message}
                </Text>
              )}
            </View>
            
            {displayRecipes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No recipes found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {isAuthenticated 
                    ? 'Try searching for a recipe or refresh for personalized suggestions'
                    : 'Sign up to get personalized recipe suggestions!'
                  }
                </Text>
              </View>
            ) : (
              displayRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} userInventory={isAuthenticated ? foodItems : []} />
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  searchButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2563eb',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 0,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f9ff',
    gap: 6,
  },
  actionButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#fef2f2',
  },
  clearButtonText: {
    color: '#dc2626',
  },
  resetButton: {
    backgroundColor: '#ecfdf5',
  },
  resetButtonText: {
    color: '#059669',
  },
  iconBtn: {
    padding: 6,
    borderRadius: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  noteBox: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    marginTop: 16,
  },
  noteText: {
    color: '#0369a1',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

 