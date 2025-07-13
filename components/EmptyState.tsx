import React from 'react';
import { YStack, Text } from 'tamagui';
import { Package, ShoppingCart, Refrigerator, AlertTriangle, Clock, CheckCircle, XCircle } from '@tamagui/lucide-icons';

interface EmptyStateProps {
  title: string;
  message: string;
  variant?: 'fresh' | 'pantry' | 'filter' | 'expired' | 'expiring' | 'watch';
}

export default function EmptyState({
  title,
  message,
  variant = 'fresh'
}: EmptyStateProps) {
  // Get appropriate icon and colors based on variant
  const getVariantConfig = () => {
    switch (variant) {
      case 'fresh':
        return {
          icon: <CheckCircle size={80} color="#9E9E9E" />,
          titleColor: '#212121',
          messageColor: '#666'
        };
      case 'pantry':
        return {
          icon: <Package size={80} color="#9E9E9E" />,
          titleColor: '#212121',
          messageColor: '#666'
        };
      case 'filter':
        return {
          icon: <ShoppingCart size={80} color="#9E9E9E" />,
          titleColor: '#212121',
          messageColor: '#666'
        };
      case 'expired':
        return {
          icon: <XCircle size={80} color="#9E9E9E" />,
          titleColor: '#212121',
          messageColor: '#666'
        };
      case 'expiring':
        return {
          icon: <AlertTriangle size={80} color="#9E9E9E" />,
          titleColor: '#212121',
          messageColor: '#666'
        };
      case 'watch':
        return {
          icon: <Clock size={80} color="#9E9E9E" />,
          titleColor: '#212121',
          messageColor: '#666'
        };
      default:
        return {
          icon: <Refrigerator size={80} color="#9E9E9E" />,
          titleColor: '#212121',
          messageColor: '#666'
        };
    }
  };

  const config = getVariantConfig();

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
        space="$4"
        maxWidth={300}
      >
        {/* Icon */}
        {config.icon}
        
        {/* Text Content */}
        <YStack alignItems="center" space="$3">
          <Text
            fontSize="$6"
            fontWeight="bold"
            color={config.titleColor}
            textAlign="center"
            lineHeight={20}
          >
            {title}
          </Text>
          
          <Text
            fontSize="$3"
            color={config.messageColor}
            textAlign="center"
            lineHeight={15}
            fontWeight="500"
          >
            {message}
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
} 