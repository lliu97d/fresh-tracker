import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore } from '../store';
import { FoodCategory } from '../store/types';
import { foodDatabase, FoodProduct } from '../services/foodDatabase';
import LoadingSpinner from '../components/LoadingSpinner';

const categories: FoodCategory[] = ['Vegetables', 'Meat', 'Dairy', 'Fruits', 'Bakery', 'Other'];
const units = ['pcs', 'g', 'kg', 'ml', 'L', 'lb', 'oz', 'bag', 'box'];

export default function ManualEntryScreen({ navigation, onRequestClose }: any) {
  const { addFoodItem } = useStore();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState(units[0]);
  const [category, setCategory] = useState<FoodCategory>(categories[0]);
  const [expiration, setExpiration] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const onSave = () => {
    const parsedQuantity = parseFloat(quantity) || 0;
    addFoodItem({
      name,
      quantity: parsedQuantity,
      originalQuantity: parsedQuantity,
      unit,
      category,
      expirationDate: expiration,
      notes: notes || undefined,
      location: 'fresh',
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
    <View style={styles.screenBg}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.stickyHeader}>
          {onRequestClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onRequestClose}
              hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Add Food Item</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            {/* Name Input with Search */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter food name"
                  placeholderTextColor="#B0B0B0"
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
                  placeholderTextColor="#B0B0B0"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Unit</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={unit}
                    onValueChange={setUnit}
                    style={styles.picker}
                    dropdownIconColor="#222"
                  >
                    {units.map((u) => (
                      <Picker.Item key={u} label={u} value={u} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={category}
                  onValueChange={(value) => setCategory(value as FoodCategory)}
                  style={styles.picker}
                  dropdownIconColor="#222"
                >
                  {categories.map((cat) => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>
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
                placeholderTextColor="#B0B0B0"
                multiline
                numberOfLines={3}
              />
            </View>
            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, (!name.trim() || !quantity.trim()) && styles.saveButtonDisabled]}
              onPress={onSave}
              disabled={!name.trim() || !quantity.trim()}
            >
              <Text style={styles.saveButtonText}>Add Food Item</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 0,
    minHeight: 60,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 30,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 22,
    color: '#222',
    fontWeight: '700',
    lineHeight: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingTop: 60, // Match stickyHeader minHeight for no gap
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    minHeight: 540,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 7,
    color: '#374151',
  },
  input: {
    borderWidth: 0,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F3F4F6',
    color: '#222',
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
  },
  halfWidth: {
    width: '48%',
  },
  pickerWrapper: {
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  picker: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: '#222',
    fontSize: 16,
    height: 48,
  },
  dateButton: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'flex-start',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#222',
    borderRadius: 32,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: '#E8E8E8',
    padding: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#222',
    fontSize: 18,
  },
  searchResults: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  searchResultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 10,
    color: '#374151',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    backgroundColor: '#F3F4F6',
  },
  closeSearchButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
}); 