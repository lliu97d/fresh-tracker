import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface FABProps {
  onPress: () => void;
  style?: ViewStyle;
}

export default function FAB({ onPress, style }: FABProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <TouchableOpacity 
      style={[
        styles.fab, 
        { bottom: Math.max(insets.bottom, 32) + 60 }, // 60 is tab bar height
        style
      ]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={32} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    backgroundColor: '#2563eb',
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
}); 