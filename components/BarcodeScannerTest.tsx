import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function BarcodeScannerTest() {
  const [testResult, setTestResult] = useState<string>('Testing...');

  const testBarcodeScanner = () => {
    try {
      const BarCodeScanner = require('expo-barcode-scanner');
      setTestResult('✅ BarCodeScanner module loaded successfully');
    } catch (error) {
      setTestResult(`❌ BarCodeScanner module failed to load: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  React.useEffect(() => {
    testBarcodeScanner();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barcode Scanner Test</Text>
      <Text style={styles.result}>{testResult}</Text>
      <Button title="Test Again" onPress={testBarcodeScanner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  result: {
    fontSize: 14,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
  },
}); 