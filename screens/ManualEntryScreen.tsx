import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, ScrollView, Alert, KeyboardAvoidingView, Modal, FlatList, findNodeHandle } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStore } from '../store';
import { FoodCategory } from '../store/types';
import { foodDatabase, FoodProduct } from '../services/foodDatabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronDown } from '@tamagui/lucide-icons';

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
  // Add state for dropdowns
  const [unitDropdownVisible, setUnitDropdownVisible] = useState(false);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  // Add ref and position state for dropdowns
  const unitButtonRef = useRef<View>(null);
  const categoryButtonRef = useRef<View>(null);
  const [unitDropdownPos, setUnitDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [categoryDropdownPos, setCategoryDropdownPos] = useState({ top: 0, left: 0, width: 0 });

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

  const showUnitDropdown = () => {
    const node = findNodeHandle(unitButtonRef.current);
    if (node && unitButtonRef.current) {
      unitButtonRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setUnitDropdownPos({ top: y + height, left: x, width });
        setUnitDropdownVisible(true);
      });
    }
  };
  const showCategoryDropdown = () => {
    const node = findNodeHandle(categoryButtonRef.current);
    if (node && categoryButtonRef.current) {
      categoryButtonRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setCategoryDropdownPos({ top: y + height, left: x, width });
        setCategoryDropdownVisible(true);
      });
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
                <TouchableOpacity
                  ref={unitButtonRef}
                  style={styles.dropdownButton}
                  onPress={showUnitDropdown}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownButtonText}>{unit}</Text>
                  <ChevronDown size={18} color="#888" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                <Modal
                  visible={unitDropdownVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setUnitDropdownVisible(false)}
                >
                  <TouchableOpacity style={styles.dropdownFullOverlay} onPress={() => setUnitDropdownVisible(false)} activeOpacity={1}>
                    <View style={[styles.dropdownPopover, { position: 'absolute', top: unitDropdownPos.top, left: unitDropdownPos.left, width: unitDropdownPos.width, maxHeight: 260 }]}>
                      <FlatList
                        data={units}
                        keyExtractor={item => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.dropdownOption}
                            onPress={() => { setUnit(item); setUnitDropdownVisible(false); }}
                          >
                            <Text style={styles.dropdownOptionText}>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
        </View>
      </View>
      {/* Category */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                ref={categoryButtonRef}
                style={styles.dropdownButton}
                onPress={showCategoryDropdown}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownButtonText}>{category}</Text>
                <ChevronDown size={18} color="#888" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
              <Modal
                visible={categoryDropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCategoryDropdownVisible(false)}
              >
                <TouchableOpacity style={styles.dropdownFullOverlay} onPress={() => setCategoryDropdownVisible(false)} activeOpacity={1}>
                  <View style={[styles.dropdownPopover, { position: 'absolute', top: categoryDropdownPos.top, left: categoryDropdownPos.left, width: categoryDropdownPos.width, maxHeight: 260 }]}>
                    <FlatList
                      data={categories}
                      keyExtractor={item => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownOption}
                          onPress={() => { setCategory(item as FoodCategory); setCategoryDropdownVisible(false); }}
                        >
                          <Text style={styles.dropdownOptionText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
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
    paddingTop: 8,
    paddingBottom: 0,
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 30,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '700',
    lineHeight: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    minHeight: 340,
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
    paddingVertical: 14,
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
    marginBottom: 0,
    minHeight: 44,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownPopover: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 1000,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  dropdownFullOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
}); 