import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
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
    forceReloadRecipes,
    isLoadingRecipes,
    foodItems,
    useMockRecipes,
    toggleMockRecipes
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
    <View style={styles.container}>
      {/* Modern Header with Dynamic Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {!isAuthenticated 
            ? 'Discover Delicious Recipes'
            : 'Your Recipe Collection'
          }
        </Text>
        <Text style={styles.subtitle}>
          {!isAuthenticated 
            ? 'Explore what FreshTracker can do for you'
            : hasExpiringItems 
              ? 'Smart suggestions based on your ingredients'
              : 'Discover recipes tailored to your preferences'
          }
        </Text>
        {isAuthenticated && useMockRecipes && (
          <View style={styles.mockModeIndicator}>
            <Ionicons name="flask" size={14} color="#388E3C" />
            <Text style={styles.mockModeIndicatorText}>Mock Mode Active</Text>
          </View>
        )}
      </View>

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
            <TouchableOpacity
              style={styles.actionButton}
              onPress={forceReloadRecipes}
              disabled={isLoadingRecipes}
            >
              <Ionicons name="refresh" size={16} color="#388E3C" />
              <Text style={styles.actionButtonText}>Refresh</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.rightActions}>
          {/* Mock Mode Switch - Only show for authenticated users */}
          {isAuthenticated && (
            <View style={styles.mockModeContainer}>
              <Text style={styles.mockModeLabel}>Mock</Text>
              <Switch
                value={useMockRecipes}
                onValueChange={toggleMockRecipes}
                trackColor={{ false: '#e5e7eb', true: '#388E3C' }}
                thumbColor={useMockRecipes ? '#ffffff' : '#f3f4f6'}
                ios_backgroundColor="#e5e7eb"
              />
            </View>
          )}
          
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={() => navigation.navigate('Calendar')}
            accessibilityLabel="Open Calendar"
          >
            <Ionicons name="calendar-outline" size={24} color="#388E3C" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {displayLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Status Note */}
            {apiStatus && !apiStatus.available && (
              <View style={styles.warningBox}>
                <Ionicons name="warning-outline" size={16} color="#e65100" />
                <Text style={styles.warningText}>{apiStatus.message}</Text>
              </View>
            )}
            
            {displayRecipes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={56} color="#BFD7ED" />
                <Text style={styles.emptyStateText}>No recipes found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {isAuthenticated 
                    ? 'Try searching for a recipe or refresh for personalized suggestions'
                    : 'Sign up to get personalized recipe suggestions!'
                  }
                </Text>
              </View>
            ) : (
              <View style={styles.recipesContainer}>
                {displayRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} userInventory={isAuthenticated ? foodItems : []} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  header: {
    backgroundColor: '#F6F7FB',
    paddingTop: 36,
    paddingBottom: 8,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    marginBottom: 8,
  },
  mockModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  mockModeIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#388E3C',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  searchButton: {
    width: 44,
    height: 44,
    backgroundColor: '#388E3C',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
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
    backgroundColor: '#E8F5E8',
    gap: 6,
  },
  actionButtonText: {
    color: '#388E3C',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#FFEBEE',
  },
  clearButtonText: {
    color: '#EF5350',
  },
  resetButton: {
    backgroundColor: '#E0F2F1',
  },
  resetButtonText: {
    color: '#059669',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mockModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mockModeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
  },
  scrollView: {
    flex: 1,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  warningText: {
    color: '#e65100',
    fontSize: 14,
    flex: 1,
  },
  recipesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

 