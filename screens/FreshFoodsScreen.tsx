import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AddItemFAB from '../components/AddItemFAB';
import ItemCard, { FreshnessStatus } from '../components/ItemCard';
import HeaderBar from '../components/HeaderBar';
import { useStore } from '../store';

export default function FoodScreen({ navigation }: any) {
  const { foodItems, getFoodItemsByLocation } = useStore();
  const [selected, setSelected] = useState<'fresh' | 'pantry'>('fresh');
  
  const freshItems = getFoodItemsByLocation('fresh');
  const pantryItems = getFoodItemsByLocation('pantry');
  
  const summary = freshItems.reduce(
    (acc, item) => {
      acc[item.status]++;
      return acc;
    },
    { fresh: 0, watch: 0, expiring: 0 }
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar title="Food" />
      {/* Segmented Control */}
      <View style={styles.segmentedContainer}>
        <TouchableOpacity
          style={[styles.segment, selected === 'fresh' && styles.segmentSelected]}
          onPress={() => setSelected('fresh')}
        >
          <Text style={[styles.segmentText, selected === 'fresh' && styles.segmentTextSelected]}>Fresh Foods</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, selected === 'pantry' && styles.segmentSelected]}
          onPress={() => setSelected('pantry')}
        >
          <Text style={[styles.segmentText, selected === 'pantry' && styles.segmentTextSelected]}>Pantry</Text>
        </TouchableOpacity>
      </View>
      {/* Content */}
      {selected === 'fresh' ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Fresh Items</Text>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBox, { backgroundColor: '#fee2e2' }]}> 
              <Text style={styles.summaryNum}>{summary.expiring}</Text>
              <Text style={styles.summaryLabel}>Expiring Soon</Text>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: '#fef9c3' }]}> 
              <Text style={styles.summaryNum}>{summary.watch}</Text>
              <Text style={styles.summaryLabel}>Watch Closely</Text>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: '#d1fae5' }]}> 
              <Text style={styles.summaryNum}>{summary.fresh}</Text>
              <Text style={styles.summaryLabel}>Fresh & Good</Text>
            </View>
          </View>
          {freshItems.map((item) => (
            <ItemCard 
              key={item.id}
              name={item.name}
              quantity={`${item.quantity} ${item.unit}`}
              category={item.category}
              calories={`${item.calories || 0} per 100g`}
              expiresInDays={Math.ceil((item.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              status={item.status}
              onViewRecipes={() => {}}
              onUpdateQty={() => {}}
            />
          ))}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Pantry & Seasonings</Text>
          {pantryItems.map((item) => (
            <View key={item.id} style={styles.pantryCard}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.expiry}>Expires {item.expirationDate.toLocaleDateString()}</Text>
              </View>
              <Text style={styles.details}>{item.quantity} {item.unit} • {item.category}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      <AddItemFAB
        onScanBarcode={() => navigation.navigate('BarcodeScanner')}
        onManualEntry={() => navigation.navigate('ManualEntry')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedContainer: {
    flexDirection: 'row',
    marginTop: 18,
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  segmentSelected: {
    backgroundColor: '#22c55e',
  },
  segmentText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  segmentTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  summaryNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b91c1c',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#444',
  },
  pantryCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  expiry: {
    fontSize: 13,
    color: '#444',
  },
  details: {
    fontSize: 15,
    color: '#555',
  },
}); 