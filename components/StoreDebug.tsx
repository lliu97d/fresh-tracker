import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useStore } from '../store';
import { Ionicons } from '@expo/vector-icons';

export default function StoreDebug() {
  const { 
    foodItems, 
    recipes, 
    clearRecipes, 
    clearAllData, 
    loadMockRecipes,
    forceReloadRecipes,
    isLoadingRecipes,
    useMockRecipes,
    toggleMockRecipes
  } = useStore();

  const handleLoadMockRecipes = () => {
    Alert.alert(
      'Load Mock Recipes',
      'This will load the development mock recipes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Load Mock', 
          onPress: () => {
            loadMockRecipes();
            Alert.alert('Success', 'Mock recipes loaded!');
          }
        }
      ]
    );
  };

  const handleClearRecipes = () => {
    Alert.alert(
      'Clear Recipes',
      'This will clear all recipes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            clearRecipes();
            Alert.alert('Success', 'Recipes cleared!');
          }
        }
      ]
    );
  };

  const handleForceReload = () => {
    Alert.alert(
      'Force Reload Recipes',
      'This will force reload recipes from API (or fallback to mock data). Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reload', 
          onPress: async () => {
            try {
              await forceReloadRecipes();
              Alert.alert('Success', 'Recipes reloaded!');
            } catch (error) {
              Alert.alert('Error', 'Failed to reload recipes');
            }
          }
        }
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear ALL data and reset to mock data. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'All data cleared and reset!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Debug Panel</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Food Items: {foodItems.length}</Text>
        <Text style={styles.statsText}>Recipes: {recipes.length}</Text>
        <Text style={styles.statsText}>Loading: {isLoadingRecipes ? 'Yes' : 'No'}</Text>
        <Text style={styles.statsText}>Mock Mode: {useMockRecipes ? 'ON' : 'OFF'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.mockButton]} 
          onPress={handleLoadMockRecipes}
        >
          <Ionicons name="restaurant" size={20} color="white" />
          <Text style={styles.buttonText}>Load Mock Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, useMockRecipes ? styles.dangerButton : styles.mockButton]} 
          onPress={toggleMockRecipes}
        >
          <Ionicons name={useMockRecipes ? "power" : "flask"} size={20} color="white" />
          <Text style={styles.buttonText}>
            {useMockRecipes ? 'Disable Mock Mode' : 'Enable Mock Mode'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.reloadButton]} 
          onPress={handleForceReload}
          disabled={isLoadingRecipes}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.buttonText}>Force Reload</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={handleClearRecipes}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.buttonText}>Clear Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]} 
          onPress={handleClearAllData}
        >
          <Ionicons name="warning" size={20} color="white" />
          <Text style={styles.buttonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        💡 Use "Enable Mock Mode" to switch between API and mock data. The switch in Recipes screen also controls this.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  mockButton: {
    backgroundColor: '#388E3C',
  },
  reloadButton: {
    backgroundColor: '#1976D2',
  },
  clearButton: {
    backgroundColor: '#FF9800',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});