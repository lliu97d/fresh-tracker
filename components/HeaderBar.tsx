import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderBarProps {
  title?: string;
}

export default function HeaderBar({ title = 'Fresh Tracker' }: HeaderBarProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconRow}>
        <TouchableOpacity onPress={() => console.log('Calendar pressed')} style={styles.iconBtn}>
          <Ionicons name="calendar-outline" size={26} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Profile pressed')} style={styles.iconBtn}>
          <Ionicons name="person-circle-outline" size={28} color="#222" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 18,
  },
}); 