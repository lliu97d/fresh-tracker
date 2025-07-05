import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import TabNavigator from './navigation/TabNavigator';
import { useStore } from './store';

export default function App() {
  const { initializeStore, isLoading, isInitialized } = useStore();

  React.useEffect(() => {
    if (!isInitialized) {
      initializeStore();
    }
  }, [isInitialized, initializeStore]);

  if (isLoading || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading FreshTracker...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <TabNavigator />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});
