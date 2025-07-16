import * as React from 'react';
import { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config';
import TabNavigator from './navigation/TabNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import SampleFoodScreen from './screens/SampleFoodScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useStore } from './store';

function AppContent() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { initializeStore, isLoading: storeLoading, isInitialized } = useStore();
  const [showAuth, setShowAuth] = React.useState(false);

  React.useEffect(() => {
    if (!isInitialized) {
      initializeStore();
    }
  }, [isInitialized, initializeStore]);

  React.useEffect(() => {
    // No logging here as per original file
  }, [isAuthenticated, authLoading, user]);

  const handleLoginSuccess = useCallback(() => {
    // User is now authenticated, store will be initialized
    // The app will automatically navigate to the Food screen (initial route)
    setShowAuth(false);
  }, [user]);

  const handleSignUpSuccess = useCallback(() => {
    // User signed up successfully, store will be initialized
    // The app will automatically navigate to the Food screen (initial route)
    setShowAuth(false);
  }, [user]);

  const handleLoginPress = useCallback(() => {
    setShowAuth(true);
  }, []);

  const handleSignUpPress = useCallback(() => {
    setShowAuth(true);
  }, []);

  const handleGoBack = useCallback(() => {
    setShowAuth(false);
  }, []);

  // Show loading screen while auth or store is initializing
  if (authLoading || storeLoading || !isInitialized) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TamaguiProvider config={config}>
      <SafeAreaProvider>
            <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading FreshTracker...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
        </TamaguiProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config}>
        <SafeAreaProvider>
          <NavigationContainer>
            {showAuth ? (
              <AuthNavigator 
                onLoginSuccess={handleLoginSuccess}
                onSignUpSuccess={handleSignUpSuccess}
                onGoBack={handleGoBack}
              />
            ) : (
              <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }} edges={['top', 'bottom']}>
                <TabNavigator onLoginPress={handleLoginPress} onSignUpPress={handleSignUpPress} />
              </SafeAreaView>
            )}
          </NavigationContainer>
        </SafeAreaProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
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


