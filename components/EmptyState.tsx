import React from 'react';
import { YStack, Text } from 'tamagui';
import { Package, ShoppingCart, Refrigerator, AlertTriangle, Clock, CheckCircle, XCircle } from '@tamagui/lucide-icons';

interface EmptyStateProps {
  title: string;
  message: string;
  variant?: 'fresh' | 'pantry' | 'filter' | 'expired' | 'expiring' | 'watch';
}

const iconMap = {
  fresh: <CheckCircle size={56} color="#BFD7ED" />,
  pantry: <Package size={56} color="#BFD7ED" />,
  filter: <ShoppingCart size={56} color="#BFD7ED" />,
  expired: <XCircle size={56} color="#BFD7ED" />,
  expiring: <AlertTriangle size={56} color="#BFD7ED" />,
  watch: <Clock size={56} color="#BFD7ED" />,
  default: <Refrigerator size={56} color="#BFD7ED" />,
};

export default function EmptyState({
  title,
  message,
  variant = 'fresh',
}: EmptyStateProps) {
  const icon = iconMap[variant] || iconMap.default;
  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      backgroundColor="#F6F7FB"
      borderRadius={18}
      padding={32}
      marginVertical={32}
      minHeight={220}
    >
      {icon}
      <Text fontSize={20} fontWeight="600" color="#222" textAlign="center" marginTop={20} marginBottom={10}>
        {title}
      </Text>
      <Text fontSize={15} color="#666" textAlign="center" lineHeight={22}>
        {message}
      </Text>
    </YStack>
  );
} 