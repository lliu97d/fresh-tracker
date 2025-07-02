import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecipeCardProps {
  name: string;
  cuisine: string;
  time: string;
  ingredients: string[];
}

export default function RecipeCard({ name, cuisine, time, ingredients }: RecipeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.cuisine}>{cuisine} • {time}</Text>
      </View>
      <View style={styles.tagsRow}>
        {ingredients.map((ing, idx) => (
          <View key={idx} style={styles.tag}>
            <Text style={styles.tagText}>{ing}</Text>
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
}); 