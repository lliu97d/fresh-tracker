import React from 'react';
import { YStack, Text, Spinner } from 'tamagui';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ message = 'Loading...', size = 'large' }: LoadingSpinnerProps) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space="$4"
      padding="$5"
    >
      <Spinner
        size={size === 'large' ? 'large' : 'small'}
        color="$primary"
      />
      {message && (
        <Text
          fontSize={size === 'large' ? '$4' : '$3'}
          color="$gray11"
          textAlign="center"
        >
          {message}
        </Text>
      )}
    </YStack>
  );
} 