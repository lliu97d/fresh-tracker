import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import TabNavigator from './navigation/TabNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <TabNavigator />
      </View>
    </NavigationContainer>
  );
}
