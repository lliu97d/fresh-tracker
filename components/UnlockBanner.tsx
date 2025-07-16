import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, YStack, XStack, Button, Card } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

interface UnlockBannerProps {
  onLoginPress: () => void;
  onSignUpPress: () => void;
  onClose?: () => void;
}

export default function UnlockBanner({ onLoginPress, onSignUpPress, onClose }: UnlockBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card
      backgroundColor="#E3F2FD"
      borderRadius={16}
      marginHorizontal={20}
      marginTop={16}
      marginBottom={16}
      padding={16}
      elevation={2}
      shadowOpacity={0.08}
      borderWidth={1}
      borderColor="#2196F3"
    >
      <XStack alignItems="center" space={12}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#2196F3',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Ionicons name="leaf" size={24} color="#FFF" />
        </View>
        <YStack flex={1}>
          <XStack justifyContent="space-between" alignItems="flex-start" marginBottom={4}>
            <Text fontSize={16} fontWeight="600" color="#1976D2" flex={1}>
              Unlock Your Food Journey
            </Text>
            <Button
              backgroundColor="transparent"
              padding={4}
              onPress={handleClose}
            >
              <Ionicons name="close" size={20} color="#1976D2" />
            </Button>
          </XStack>
          <Text fontSize={14} color="#1565C0" lineHeight={20} marginBottom={12}>
            Sign in to track your own food items, get personalized recipes, and never waste food again!
          </Text>
          <XStack space={8}>
            <Button
              backgroundColor="#2196F3"
              borderRadius={12}
              paddingHorizontal={16}
              paddingVertical={8}
              onPress={onLoginPress}
              flex={1}
            >
              <Text fontSize={14} color="#FFF" fontWeight="600">Sign In</Text>
            </Button>
            <Button
              backgroundColor="#4CAF50"
              borderRadius={12}
              paddingHorizontal={16}
              paddingVertical={8}
              onPress={onSignUpPress}
              flex={1}
            >
              <Text fontSize={14} color="#FFF" fontWeight="600">Sign Up</Text>
            </Button>
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
} 