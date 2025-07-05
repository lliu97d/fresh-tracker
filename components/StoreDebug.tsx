import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useStore } from '../store';

export default function StoreDebug() {
  const { 
    recipes, 
    foodItems, 
    userProfile, 
    isLoadingRecipes,
    forceReloadRecipes,
    resetRecipes 
  } = useStore();

  const handleForceReload = async () => {
    console.log('🔧 Manual force reload triggered');
    await forceReloadRecipes();
  };

  const handleReset = async () => {
    console.log('🔧 Manual reset triggered');
    await resetRecipes();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Debug Info</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Recipes:</Text>
        <Text style={styles.value}>{recipes.length}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Food Items:</Text>
        <Text style={styles.value}>{foodItems.length}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Loading:</Text>
        <Text style={styles.value}>{isLoadingRecipes ? 'Yes' : 'No'}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Diet Preferences:</Text>
        <Text style={styles.value}>{userProfile.dietPreferences.join(', ') || 'None'}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Favorite Cuisine:</Text>
        <Text style={styles.value}>{userProfile.favoriteCuisine}</Text>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleForceReload}>
          <Text style={styles.buttonText}>Force Reload</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      
      {recipes.length > 0 && (
        <View style={styles.recipeList}>
          <Text style={styles.subtitle}>First 3 Recipes:</Text>
          {recipes.slice(0, 3).map((recipe, index) => (
            <Text key={recipe.id} style={styles.recipeItem}>
              {index + 1}. {recipe.name} ({recipe.cuisine})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#495057',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#495057',
  },
  recipeList: {
    marginTop: 8,
  },
  recipeItem: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
}); 