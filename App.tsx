import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config';
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
      <TamaguiProvider config={config}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading FreshTracker...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
      </TamaguiProvider>
    );
  }

  return (
    <TamaguiProvider config={config}>
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
          <TabNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
    </TamaguiProvider>
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


