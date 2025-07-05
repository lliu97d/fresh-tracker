import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AddItemFAB from '../components/AddItemFAB';
import { useStore } from '../store';

export default function PantryScreen({ navigation }: any) {
  const { getFoodItemsByLocation } = useStore();
  const pantryItems = getFoodItemsByLocation('pantry');

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pantry & Seasonings</Text>
        {pantryItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.expiry}>Expires {item.expirationDate.toLocaleDateString()}</Text>
            </View>
            <Text style={styles.details}>{item.quantity} {item.unit} • {item.category}</Text>
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