import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import { foodDatabase, FoodProduct } from '../services/foodDatabase';
import { useStore } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';

// Import BarCodeScanner with error handling
let BarCodeScanner: any = null;
try {
  BarCodeScanner = require('expo-barcode-scanner').BarCodeScanner;
} catch (error) {
  console.warn('BarCodeScanner not available:', error);
}

export default function BarcodeScannerScreen({ navigation }: any) {
  const { addFoodItem } = useStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [product, setProduct] = useState<FoodProduct | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('pcs');
  const [scannerAvailable, setScannerAvailable] = useState(true);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      if (!BarCodeScanner) {
        setScannerAvailable(false);
        return;
      }

      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setScannerAvailable(false);
      }
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setIsSearching(true);
    
    try {
      const foundProduct = await foodDatabase.searchByBarcode(data);
      setProduct(foundProduct);
      
      if (!foundProduct) {
        Alert.alert(
          'Product Not Found',
          'This barcode was not found in our database. You can still add it manually.',
          [
            { text: 'Add Manually', onPress: () => navigation.navigate('ManualEntry') },
            { text: 'Try Again', onPress: () => setScanned(false) },
            { text: 'Cancel', onPress: () => navigation.goBack() },
          ]
        );
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      Alert.alert('Error', 'Failed to scan barcode. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddProduct = () => {
    if (!product) return;

    const foodItem = foodDatabase.toFoodItem(product, parseFloat(quantity) || 1, unit);
    addFoodItem(foodItem);
    
    Alert.alert(
      'Success!',
      `${product.name} has been added to your inventory.`,
      [
        { text: 'Add Another', onPress: () => {
          setScanned(false);
          setProduct(null);
          setQuantity('1');
        }},
        { text: 'Done', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleManualEntry = () => {
    navigation.navigate('ManualEntry');
  };

  // Show error if scanner is not available
  if (!scannerAvailable) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Barcode Scanner Unavailable</Text>
        <Text style={styles.errorSubtext}>
          The barcode scanner requires a development build to work properly.
        </Text>
        <Text style={styles.errorSubtext}>
          However, you can still use our enhanced manual entry feature with food database search!
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>✅ Search products by name</Text>
          <Text style={styles.featureItem}>✅ Get nutritional information</Text>
          <Text style={styles.featureItem}>✅ Auto-detect food categories</Text>
          <Text style={styles.featureItem}>✅ Suggested expiration dates</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Try Enhanced Manual Entry" onPress={handleManualEntry} />
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  if (hasPermission === null) {
    return <LoadingSpinner message="Requesting camera permission..." />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No access to camera</Text>
        <Text style={styles.errorSubtext}>Camera permission is required to scan barcodes.</Text>
        <View style={styles.buttonContainer}>
          <Button title="Manual Entry" onPress={handleManualEntry} />
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  if (isSearching) {
    return <LoadingSpinner message="Looking up product..." />;
  }

  if (product) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.productContainer}>
          <Text style={styles.title}>Product Found!</Text>
          
          {product.imageUrl && (
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
          )}
          
          <Text style={styles.productName}>{product.name}</Text>
          {product.brand && <Text style={styles.brand}>{product.brand}</Text>}
          {product.description && <Text style={styles.description}>{product.description}</Text>}
          
          <View style={styles.nutritionContainer}>
            <Text style={styles.sectionTitle}>Nutrition (per 100g)</Text>
            {product.nutrition.calories && (
              <Text style={styles.nutritionText}>Calories: {product.nutrition.calories} kcal</Text>
            )}
            {product.nutrition.protein && (
              <Text style={styles.nutritionText}>Protein: {product.nutrition.protein}g</Text>
            )}
            {product.nutrition.carbs && (
              <Text style={styles.nutritionText}>Carbs: {product.nutrition.carbs}g</Text>
            )}
            {product.nutrition.fat && (
              <Text style={styles.nutritionText}>Fat: {product.nutrition.fat}g</Text>
            )}
          </View>

          {product.ingredients && (
            <View style={styles.ingredientsContainer}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.ingredientsText}>{product.ingredients.join(', ')}</Text>
            </View>
          )}

          {product.allergens && product.allergens.length > 0 && (
            <View style={styles.allergensContainer}>
              <Text style={styles.sectionTitle}>Allergens</Text>
              <Text style={styles.allergensText}>{product.allergens.join(', ')}</Text>
            </View>
          )}

          <View style={styles.addContainer}>
            <Text style={styles.sectionTitle}>Add to Inventory</Text>
            <Text style={styles.quantityText}>
              Quantity: {quantity} {unit}
            </Text>
            <Text style={styles.expirationText}>
              Suggested expiration: {product.expirationSuggestion || 7} days
            </Text>
            
            <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
              <Text style={styles.addButtonText}>Add to Inventory</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button title="Scan Another" onPress={() => {
            setScanned(false);
            setProduct(null);
            setQuantity('1');
          }} />
          <Button title="Manual Entry" onPress={handleManualEntry} />
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {BarCodeScanner && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.scanText}>Position barcode within the frame</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Manual Entry" onPress={handleManualEntry} />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  productContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2563eb',
  },
  productImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  brand: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  nutritionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
  },
  nutritionText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#374151',
  },
  ingredientsContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  allergensContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fef2f2',
    borderRadius: 10,
  },
  allergensText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  addContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
  },
  quantityText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#374151',
  },
  expirationText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureList: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
  },
  featureItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
  },
}); 