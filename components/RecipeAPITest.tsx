import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { recipeAPI } from '../services/recipeAPI';

export default function RecipeAPITest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string>('');

  const testAPI = async () => {
    setIsLoading(true);
    setTestResults('Testing API...\n');
    
    try {
      // Test 1: Simple search
      setTestResults(prev => prev + 'Testing simple search...\n');
      const searchResults = await recipeAPI.searchRecipes('chicken', undefined, undefined, undefined, 30, 3);
      setTestResults(prev => prev + `Search results: ${searchResults.length} recipes\n`);
      
      // Test 2: Ingredients search
      setTestResults(prev => prev + 'Testing ingredients search...\n');
      const ingredientResults = await recipeAPI.findRecipesByIngredients(['chicken', 'rice'], 2, true, 3);
      setTestResults(prev => prev + `Ingredients results: ${ingredientResults.length} recipes\n`);
      
      // Test 3: Personalized suggestions
      setTestResults(prev => prev + 'Testing personalized suggestions...\n');
      const personalizedResults = await recipeAPI.getPersonalizedSuggestions(
        [
          { id: '1', name: 'chicken', quantity: 1, unit: 'lb', category: 'Meat', expirationDate: new Date(), addedDate: new Date(), status: 'watch', location: 'fresh' },
          { id: '2', name: 'tomatoes', quantity: 4, unit: 'pieces', category: 'Vegetables', expirationDate: new Date(), addedDate: new Date(), status: 'expiring', location: 'fresh' }
        ],
        ['healthy'],
        [],
        'Italian'
      );
      setTestResults(prev => prev + `Personalized results: ${personalizedResults.length} recipes\n`);
      
      setTestResults(prev => prev + '✅ All tests completed successfully!\n');
      
    } catch (error) {
      console.error('API Test Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => prev + `❌ Error: ${errorMessage}\n`);
      Alert.alert('API Test Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe API Test</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={testAPI}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Recipe API'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        <Text style={styles.resultsText}>{testResults}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
}); 