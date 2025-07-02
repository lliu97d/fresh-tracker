import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AddItemFAB from '../components/AddItemFAB';
import ItemCard, { FreshnessStatus } from '../components/ItemCard';
import HeaderBar from '../components/HeaderBar';

const mockItems = [
  {
    name: 'Fresh Spinach',
    quantity: '1 bag',
    category: 'Vegetables',
    calories: '23 per 100g',
    expiresInDays: 4,
    status: 'fresh' as FreshnessStatus,
  },
  {
    name: 'Ground Beef',
    quantity: '1 lb',
    category: 'Meat',
    calories: '250 per 100g',
    expiresInDays: 2,
    status: 'watch' as FreshnessStatus,
  },
  {
    name: 'Milk',
    quantity: '1 gallon',
    category: 'Dairy',
    calories: '42 per 100ml',
    expiresInDays: 1,
    status: 'expiring' as FreshnessStatus,
  },
];

export default function FreshFoodsScreen({ navigation }: any) {
  const summary = mockItems.reduce(
    (acc, item) => {
      acc[item.status]++;
      return acc;
    },
    { fresh: 0, watch: 0, expiring: 0 }
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderBar />
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
        {mockItems.map((item, idx) => (
          <ItemCard key={idx} {...item} />
        ))}
      </ScrollView>
      <AddItemFAB
        onScanBarcode={() => navigation.navigate('BarcodeScanner')}
        onManualEntry={() => navigation.navigate('ManualEntry')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 