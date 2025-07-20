import React, { useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

interface AuthNavigatorProps {
  onLoginSuccess: () => void;
  onSignUpSuccess: () => void;
}

export default function AuthNavigator({ onLoginSuccess, onSignUpSuccess }: AuthNavigatorProps) {
  // Memoize screen components to prevent inline function warnings
  const LoginScreenComponent = useCallback((props: any) => (
    <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />
  ), [onLoginSuccess]);

  const SignUpScreenComponent = useCallback((props: any) => (
    <SignUpScreen {...props} onSignUpSuccess={onSignUpSuccess} />
  ), [onSignUpSuccess]);

  const ForgotPasswordScreenComponent = useCallback((props: any) => (
    <ForgotPasswordScreen {...props} />
  ), []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreenComponent}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreenComponent}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreenComponent}
      />
    </Stack.Navigator>
  );
} 