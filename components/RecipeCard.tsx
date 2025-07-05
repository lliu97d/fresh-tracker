import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RecipeIngredient, FoodItem } from '../store/types';

interface RecipeCardProps {
  name: string;
  cuisine: string;
  time: string;
  ingredients: RecipeIngredient[];
  userInventory?: FoodItem[];
}

export default function RecipeCard({ name, cuisine, time, ingredients, userInventory = [] }: RecipeCardProps) {
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

  // Determine card style based on availability
  const getCardStyle = () => {
    if (availabilityPercentage >= 80) {
      return [styles.card, styles.cardReady];
    } else if (availabilityPercentage >= 50) {
      return [styles.card, styles.cardPartial];
    } else {
      return [styles.card, styles.cardNeedsMore];
    }
  };

  return (
    <View style={getCardStyle()}>
      <View style={styles.headerRow}>
        <View style={styles.titleSection}>
          <Text style={styles.name}>{name}</Text>
          <View style={[
            styles.statusBadge,
            availabilityPercentage >= 80 ? styles.statusReady :
            availabilityPercentage >= 50 ? styles.statusPartial :
            styles.statusNeedsMore
          ]}>
            <Text style={[
              styles.statusText,
              availabilityPercentage >= 80 ? styles.statusTextReady :
              availabilityPercentage >= 50 ? styles.statusTextPartial :
              styles.statusTextNeedsMore
            ]}>
              {availabilityPercentage >= 80 ? 'Ready' : availabilityPercentage >= 50 ? 'Partial' : 'Need More'}
            </Text>
          </View>
        </View>
        <Text style={styles.cuisine}>{cuisine} • {time}</Text>
      </View>
      
      {/* Ingredient availability summary */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {availableIngredients.length} of {ingredients.length} ingredients available 
          ({Math.round((availableIngredients.length / ingredients.length) * 100)}%)
        </Text>
      </View>
      
      <View style={styles.tagsRow}>
        {/* Available ingredients */}
        {availableIngredients.map((ing, idx) => (
          <View key={`available-${idx}`} style={styles.availableTag}>
            <Text style={styles.availableTagText}>✓ {ing.name}</Text>
          </View>
        ))}
        
        {/* Missing ingredients */}
        {missingIngredients.map((ing, idx) => (
          <View key={`missing-${idx}`} style={styles.missingTag}>
            <Text style={styles.missingTagText}>✗ {ing.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  cuisine: {
    fontSize: 13,
    color: '#2563eb',
    marginLeft: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  summaryRow: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  tag: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 13,
    color: '#1e40af',
  },
  availableTag: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  availableTagText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '500',
  },
  missingTag: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  missingTagText: {
    fontSize: 13,
    color: '#991b1b',
    fontWeight: '500',
  },
  cardReady: {
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  cardPartial: {
    borderColor: '#f59e0b',
    borderWidth: 2,
  },
  cardNeedsMore: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  titleSection: {
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  statusReady: {
    backgroundColor: '#dcfce7',
  },
  statusPartial: {
    backgroundColor: '#fef3c7',
  },
  statusNeedsMore: {
    backgroundColor: '#fee2e2',
  },
  statusTextReady: {
    color: '#166534',
  },
  statusTextPartial: {
    color: '#92400e',
  },
  statusTextNeedsMore: {
    color: '#991b1b',
  },
}); 