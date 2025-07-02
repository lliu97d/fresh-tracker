import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AddItemFAB from '../components/AddItemFAB';
import HeaderBar from '../components/HeaderBar';

const mockPantryItems = [
  {
    name: 'Soy Sauce',
    quantity: '1 bottle',
    category: 'Condiments',
    expires: '3/14/2026',
  },
  {
    name: 'Sea Salt',
    quantity: '500g',
    category: 'Spices',
    expires: '12/31/2026',
  },
  {
    name: 'Olive Oil',
    quantity: '1L',
    category: 'Oils',
    expires: '11/10/2025',
  },
];

export default function PantryScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pantry & Seasonings</Text>
        {mockPantryItems.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.expiry}>Expires {item.expires}</Text>
            </View>
            <Text style={styles.details}>{item.quantity} • {item.category}</Text>
          </View>
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
  card: {
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