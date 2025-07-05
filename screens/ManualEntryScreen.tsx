import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore } from '../store';
import { FoodCategory } from '../store/types';
import { foodDatabase, FoodProduct } from '../services/foodDatabase';
import LoadingSpinner from '../components/LoadingSpinner';

const categories: FoodCategory[] = ['Vegetables', 'Meat', 'Dairy', 'Fruits', 'Bakery', 'Other'];
const units = ['pcs', 'g', 'kg', 'ml', 'L', 'lb', 'oz', 'bag', 'box'];

export default function ManualEntryScreen({ navigation }: any) {
  const { addFoodItem } = useStore();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState(units[0]);
  const [category, setCategory] = useState<FoodCategory>(categories[0]);
  const [expiration, setExpiration] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Food database search states
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const onSave = () => {
    addFoodItem({
      name,
      quantity: parseFloat(quantity) || 0,
      unit,
      category,
      expirationDate: expiration,
      notes: notes || undefined,
      location: 'fresh', // Default to fresh items
    });
    navigation.goBack();
  };

  const handleSearch = async () => {
    if (!name.trim()) return;

    setIsSearching(true);
    setShowSearchResults(false);
    
    try {
      const results = await foodDatabase.searchUSDA(name);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching:', error);
      Alert.alert('Error', 'Failed to search for products. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (product: FoodProduct) => {
    setName(product.name);
    setCategory(product.category);
    if (product.expirationSuggestion) {
      const newExpiration = new Date();
      newExpiration.setDate(newExpiration.getDate() + product.expirationSuggestion);
      setExpiration(newExpiration);
    }
    setShowSearchResults(false);
    
    // Show nutrition info if available
    if (product.nutrition.calories) {
      Alert.alert(
        'Nutrition Info',
        `Calories: ${product.nutrition.calories} kcal per 100g\nProtein: ${product.nutrition.protein || 0}g\nCarbs: ${product.nutrition.carbs || 0}g\nFat: ${product.nutrition.fat || 0}g`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDate(Platform.OS === 'ios');
    if (selectedDate) {
      setExpiration(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Food Item</Text>

      {/* Name Input with Search */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name *</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter food name"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>
        
        {isSearching && <LoadingSpinner message="Searching..." size="small" />}
        
        {showSearchResults && searchResults.length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsTitle}>Found Products:</Text>
            {searchResults.map((product, index) => (
              <TouchableOpacity
                key={product.id}
                style={styles.searchResultItem}
                onPress={() => handleSelectProduct(product)}
              >
                <Text style={styles.searchResultName}>{product.name}</Text>
                {product.brand && <Text style={styles.searchResultBrand}>{product.brand}</Text>}
                {product.nutrition.calories && (
                  <Text style={styles.searchResultNutrition}>
                    {product.nutrition.calories} kcal per 100g
                  </Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeSearchButton}
              onPress={() => setShowSearchResults(false)}
            >
              <Text style={styles.closeSearchButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quantity and Unit */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Unit</Text>
          <Picker
            selectedValue={unit}
            onValueChange={setUnit}
            style={styles.picker}
          >
            {units.map((u) => (
              <Picker.Item key={u} label={u} value={u} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Category */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value as FoodCategory)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      {/* Expiration Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Expiration Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDate(true)}
        >
          <Text style={styles.dateButtonText}>
            {expiration.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDate && (
          <DateTimePicker
            value={expiration}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Notes */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Additional notes..."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Save Item"
          onPress={onSave}
          disabled={!name.trim() || !quantity.trim()}
        />
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2563eb',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchResults: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  searchResultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 10,
    color: '#374151',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  searchResultBrand: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  searchResultNutrition: {
    fontSize: 12,
    color: '#059669',
    marginTop: 2,
  },
  closeSearchButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  closeSearchButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
}); 