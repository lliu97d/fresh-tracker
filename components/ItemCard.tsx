import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type FreshnessStatus = 'fresh' | 'watch' | 'expiring';

interface ItemCardProps {
  name: string;
  quantity: string;
  category: string;
  calories: string;
  expiresInDays: number;
  status: FreshnessStatus;
  onViewRecipes?: () => void;
  onUpdateQty?: () => void;
}

const statusColors = {
  fresh: '#d1fae5', // green
  watch: '#fef9c3', // yellow
  expiring: '#fee2e2', // red
};
const borderColors = {
  fresh: '#34d399',
  watch: '#fde047',
  expiring: '#f87171',
};

export default function ItemCard({
  name,
  quantity,
  category,
  calories,
  expiresInDays,
  status,
  onViewRecipes,
  onUpdateQty,
}: ItemCardProps) {
  let statusText = '';
  if (status === 'fresh') statusText = 'Fresh & Good';
  else if (status === 'watch') statusText = 'Watch Closely';
  else statusText = 'Expiring Soon';

  return (
    <View style={[styles.card, { backgroundColor: statusColors[status], borderColor: borderColors[status] }]}> 
      <View style={styles.headerRow}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.expiry}>Expires in <Text style={{ fontWeight: 'bold' }}>{expiresInDays} days</Text></Text>
      </View>
      <Text style={styles.details}>{quantity} • {category}</Text>
      <Text style={styles.calories}>🔥 {calories}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onViewRecipes}>
          <Text style={styles.buttonText}>View Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onUpdateQty}>
          <Text style={styles.buttonText}>Update Qty</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expiry: {
    fontSize: 14,
    color: '#222',
  },
  details: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  calories: {
    fontSize: 14,
    color: '#f87171',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2563eb',
  },
}); 