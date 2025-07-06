import React from 'react';
import { Button } from 'tamagui';

interface TamaguiButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  [key: string]: any;
}

export default function TamaguiButton({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  ...props 
}: TamaguiButtonProps) {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '$primary',
          color: 'white',
          borderColor: '$primary',
          pressStyle: {
            backgroundColor: '$primaryPress',
          },
        };
      case 'secondary':
        return {
          backgroundColor: '$secondary',
          color: 'white',
          borderColor: '$secondary',
          pressStyle: {
            backgroundColor: '$secondaryPress',
          },
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '$primary',
          borderColor: '$primary',
          borderWidth: 1,
          pressStyle: {
            backgroundColor: '$backgroundPress',
          },
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '$color',
          pressStyle: {
            backgroundColor: '$backgroundPress',
          },
        };
      default:
        return {};
    }
  };

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: '$3',
          paddingVertical: '$2',
        };
      case 'medium':
        return {
          paddingHorizontal: '$4',
          paddingVertical: '$3',
        };
      case 'large':
        return {
          paddingHorizontal: '$5',
          paddingVertical: '$4',
        };
      default:
        return {};
    }
  };

  return (
    <Button
      borderRadius="$4"
      fontWeight="600"
      {...getVariantProps()}
      {...getSizeProps()}
      {...props}
    >
      {children}
    </Button>
  );
} 