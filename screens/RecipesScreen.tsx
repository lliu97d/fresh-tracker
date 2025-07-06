import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { Ionicons } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useStore } from '../store';

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
        {isLoadingRecipes ? (
          <LoadingSpinner />
        ) : (
          <>
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                {hasExpiringItems 
                  ? '🍳 Smart suggestions based on your expiring items and preferences!'
                  : '🍳 Discover delicious recipes tailored to your preferences!'
                }
              </Text>
            </View>
            
            {recipes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No recipes found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try searching for a recipe or refresh for personalized suggestions
                </Text>
              </View>
            ) : (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} userInventory={foodItems} />
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

 