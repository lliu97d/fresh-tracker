import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const categories = ['Vegetables', 'Meat', 'Dairy', 'Fruit', 'Bakery', 'Other'];
const units = ['pcs', 'g', 'kg', 'ml', 'L', 'lb', 'oz', 'bag', 'box'];

export default function ManualEntryScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState(units[0]);
  const [category, setCategory] = useState(categories[0]);
  const [expiration, setExpiration] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [notes, setNotes] = useState('');

  const onSave = () => {
    const data = { name, quantity, unit, category, expiration, notes };
    console.log('Saved item:', data);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Item Manually</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <View style={[styles.pickerWrapper, { flex: 1 }]}> 
          <Picker
            selectedValue={unit}
            onValueChange={setUnit}
            style={styles.picker}
          >
            {units.map(u => <Picker.Item key={u} label={u} value={u} />)}
          </Picker>
        </View>
      </View>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={styles.picker}
        >
          {categories.map(c => <Picker.Item key={c} label={c} value={c} />)}
        </Picker>
      </View>
      <TouchableOpacity onPress={() => setShowDate(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>Expiration: {expiration.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker
          value={expiration}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowDate(false);
            if (date) setExpiration(date);
          }}
        />
      )}
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={() => navigation.goBack()} color="#888" />
        <Button title="Save" onPress={onSave} color="#22c55e" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    marginBottom: 14,
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    width: '100%',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#f9fafb',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#222',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
}); 