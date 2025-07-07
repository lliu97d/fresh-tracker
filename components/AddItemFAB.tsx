import React, { useState } from 'react';
import { Modal, TouchableOpacity, Text, StyleSheet, Pressable, ViewStyle, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FAB from './FAB';

interface AddItemFABProps {
  onScanBarcode: () => void;
  onManualEntry: () => void;
  style?: ViewStyle;
}

export default function AddItemFAB({ onScanBarcode, onManualEntry, style }: AddItemFABProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleOption = (option: 'scan' | 'manual') => {
    setModalVisible(false);
    if (option === 'scan') onScanBarcode();
    else onManualEntry();
  };

  return (
    <>
      <FAB onPress={() => setModalVisible(true)} style={style} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 40) }]} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Add New Item</Text>
            <TouchableOpacity style={styles.sheetButton} onPress={() => handleOption('scan')}>
              <Text style={styles.sheetButtonText}>Scan Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetButton} onPress={() => handleOption('manual')}>
              <Text style={styles.sheetButtonText}>Manual Entry</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sheetButton: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  sheetButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 