import React from 'react';
import { YStack, Text, Button } from 'tamagui';
import { Package, Plus } from '@tamagui/lucide-icons';

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  message,
  actionText,
  onAction,
  icon = <Package size={48} color="$gray9" />
}: EmptyStateProps) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space="$4"
      padding="$5"
    >
      <YStack
        alignItems="center"
        space="$3"
        padding="$6"
        backgroundColor="$gray2"
        borderRadius="$6"
        borderColor="$gray6"
        borderWidth={1}
      >
        {icon}
        
        <YStack alignItems="center" space="$2">
          <Text
            fontSize="$5"
            fontWeight="bold"
            color="$color"
            textAlign="center"
          >
            {title}
          </Text>
          
          <Text
            fontSize="$3"
            color="$gray10"
            textAlign="center"
            maxWidth={280}
          >
            {message}
          </Text>
        </YStack>
        
        {actionText && onAction && (
          <Button
            size="$3"
            backgroundColor="$primary"
            color="white"
            borderRadius="$4"
            paddingHorizontal="$4"
            paddingVertical="$2"
            onPress={onAction}
            pressStyle={{ backgroundColor: '$primary' }}
            marginTop="$2"
          >
            <Plus size={16} marginRight="$2" />
            <Text fontSize="$3" fontWeight="600">
              {actionText}
            </Text>
          </Button>
        )}
      </YStack>
    </YStack>
  );
} 