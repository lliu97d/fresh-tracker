import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RecipeIngredient, FoodItem } from '../store/types';
import { Clock, Flame, Users, CheckCircle, XCircle } from '@tamagui/lucide-icons';

interface RecipeCardProps {
  name: string;
  cuisine: string;
  time: string;
  ingredients: RecipeIngredient[];
  userInventory?: FoodItem[];
  calories?: number;
  servings?: number;
}

export default function RecipeCard({ 
  name, 
  cuisine, 
  time, 
  ingredients, 
  userInventory = [],
  calories = 0,
  servings = 1
}: RecipeCardProps) {
  // Helper function to check if ingredient is available
  const isIngredientAvailable = (ingredientName: string): boolean => {
    const cleanIngredientName = ingredientName.toLowerCase()
      .replace(/\([^)]*\)/g, '') // Remove parentheses content
      .replace(/[^\w\s]/g, '') // Remove special characters
        .trim();
    
    return userInventory.some(item => {
      const cleanItemName = item.name.toLowerCase()
        .replace(/\([^)]*\)/g, '') // Remove parentheses content
        .replace(/[^\w\s]/g, '') // Remove special characters
        .trim();
      
      // Check for exact match or partial match
      return cleanItemName === cleanIngredientName ||
             cleanItemName.includes(cleanIngredientName) ||
             cleanIngredientName.includes(cleanItemName);
    });
  };

  // Count available and missing ingredients
  const availableIngredients = ingredients.filter(ing => isIngredientAvailable(ing.name));
  const missingIngredients = ingredients.filter(ing => !isIngredientAvailable(ing.name));
  const availabilityPercentage = Math.round((availableIngredients.length / ingredients.length) * 100);

  // Determine availability status
  const getAvailabilityStatus = () => {
    if (availabilityPercentage >= 80) {
      return { status: 'Ready', color: '#388E3C', backgroundColor: '#E8F5E8' };
    } else if (availabilityPercentage >= 50) {
      return { status: 'Partial', color: '#F59E0B', backgroundColor: '#FEF3C7' };
    } else {
      return { status: 'Need More', color: '#EF5350', backgroundColor: '#FFEBEE' };
    }
  };

  const availability = getAvailabilityStatus();

  return (
    <View style={styles.card}>
      {/* Header with title and availability status */}
      <View style={styles.headerRow}>
        <Text style={styles.recipeName} numberOfLines={2}>
          {name}
        </Text>
        <View style={[styles.availabilityBadge, { backgroundColor: availability.backgroundColor }]}>
          <Text style={[styles.availabilityText, { color: availability.color }]}>
            {availability.status}
          </Text>
        </View>
      </View>

      {/* Recipe metadata */}
      <Text style={styles.cuisineInfo}>
        {cuisine} • {time}
      </Text>

      {/* Recipe stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Clock size={14} color="#388E3C" />
          <Text style={styles.statText}>{time}</Text>
        </View>
        {calories > 0 && (
          <View style={styles.statItem}>
            <Flame size={14} color="#FF6B35" />
            <Text style={styles.statText}>{calories} cal</Text>
          </View>
        )}
        {servings > 1 && (
          <View style={styles.statItem}>
            <Users size={14} color="#388E3C" />
            <Text style={styles.statText}>{servings} servings</Text>
          </View>
        )}
      </View>

      {/* Ingredient availability summary */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {availableIngredients.length} of {ingredients.length} ingredients available 
          ({availabilityPercentage}%)
        </Text>
      </View>
      
      {/* Ingredients with pill shapes */}
      <View style={styles.ingredientsContainer}>
        {/* Available ingredients */}
        {availableIngredients.map((ing, idx) => (
          <View key={`available-${idx}`} style={styles.availablePill}>
            <CheckCircle size={12} color="#388E3C" />
            <Text style={styles.availablePillText}>
              {ing.name} {ing.amount > 0 && `(${ing.amount} ${ing.unit})`}
            </Text>
          </View>
        ))}
        
        {/* Missing ingredients */}
        {missingIngredients.map((ing, idx) => (
          <View key={`missing-${idx}`} style={styles.missingPill}>
            <XCircle size={12} color="#EF5350" />
            <Text style={styles.missingPillText}>
              {ing.name} {ing.amount > 0 && `(${ing.amount} ${ing.unit})`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    flex: 1,
    marginRight: 8,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cuisineInfo: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  summaryRow: {
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  availablePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#388E3C',
  },
  availablePillText: {
    fontSize: 12,
    color: '#388E3C',
    fontWeight: '500',
  },
  missingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  missingPillText: {
    fontSize: 12,
    color: '#EF5350',
    fontWeight: '500',
  },
}); 