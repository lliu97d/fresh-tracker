import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import HeaderBar from '../components/HeaderBar';

const mockRecipes = [
  {
    name: 'Chinese Beef Stir Fry',
    cuisine: 'Chinese',
    time: '20 mins',
    ingredients: ['Ground Beef', 'Spinach', 'Soy Sauce'],
  },
  {
    name: 'Creamy Spinach Soup',
    cuisine: 'Western',
    time: '15 mins',
    ingredients: ['Spinach', 'Milk'],
  },
];

export default function RecipesScreen() {
  return (
    <View style={{ flex: 1 }}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Suggested Recipes</Text>
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            🤖 AI suggests these recipes based on your expiring items and Chinese food preference!
          </Text>
        </View>
        {mockRecipes.map((recipe, idx) => (
          <RecipeCard key={idx} {...recipe} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noteBox: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  noteText: {
    color: '#0369a1',
    fontSize: 14,
  },
}); 