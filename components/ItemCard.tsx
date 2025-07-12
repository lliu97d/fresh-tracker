import React from 'react';
import { Card, Text, XStack, YStack, Button, Stack } from 'tamagui';
import { Calendar, Flame, Package } from '@tamagui/lucide-icons';

export type FreshnessStatus = 'fresh' | 'watch' | 'expiring' | 'expired';

interface ItemCardProps {
  name: string;
  quantity: string;
  category: string;
  calories: string;
  expiresInDays: number;
  status: FreshnessStatus;
  onViewRecipes?: () => void;
  onUpdateQty?: () => void;
}

const statusConfig = {
  fresh: {
    backgroundColor: '$green2',
    borderColor: '$green8',
    textColor: '$green11',
    iconColor: '$green9',
    badgeColor: '$green9',
  },
  watch: {
    backgroundColor: '$yellow2',
    borderColor: '$yellow8',
    textColor: '$yellow11',
    iconColor: '$yellow9',
    badgeColor: '$yellow9',
  },
  expiring: {
    backgroundColor: '$red2',
    borderColor: '$red8',
    textColor: '$red11',
    iconColor: '$red9',
    badgeColor: '$red9',
  },
  expired: {
    backgroundColor: '$gray2',
    borderColor: '$gray8',
    textColor: '$gray11',
    iconColor: '$gray9',
    badgeColor: '$gray9',
  },
};

export default function ItemCard({
  name,
  quantity,
  category,
  calories,
  expiresInDays,
  status,
  onViewRecipes,
  onUpdateQty,
}: ItemCardProps) {
  const config = statusConfig[status];
  
  let statusText = '';
  if (status === 'fresh') statusText = 'Fresh & Good';
  else if (status === 'watch') statusText = 'Watch Closely';
  else if (status === 'expiring') statusText = 'Expiring Soon';
  else statusText = 'Expired';

  return (
    <Card
      elevate
      size="$4"
      bordered
      scale={0.9}
      hoverStyle={{ scale: 0.95 }}
      pressStyle={{ scale: 0.85 }}
      backgroundColor={config.backgroundColor}
      borderColor={config.borderColor}
      marginBottom="$4"
      padding="$4"
      borderRadius="$4"
    >
      <YStack space="$3">
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center">
          <YStack flex={1}>
            <Text fontSize="$6" fontWeight="bold" color="$color">
              {name}
            </Text>
            <Text fontSize="$3" color="$gray10" marginTop="$1">
              {quantity} • {category}
            </Text>
          </YStack>
          <Text
            backgroundColor={config.badgeColor}
            color="white"
            fontSize="$2"
            fontWeight="600"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
          >
            {statusText}
          </Text>
        </XStack>

        {/* Details */}
        <XStack space="$3" alignItems="center">
          <Stack space="$1" alignItems="center" flexDirection="row">
            <Calendar size={16} color={config.iconColor} />
            <Text fontSize="$3" color={config.textColor} fontWeight="600">
              {expiresInDays} days
            </Text>
          </Stack>
          
          <Stack space="$1" alignItems="center" flexDirection="row">
            <Flame size={16} color="$orange9" />
            <Text fontSize="$3" color="$gray11">
              {calories}
            </Text>
          </Stack>
        </XStack>

        {/* Actions */}
        <XStack space="$2" marginTop="$2">
          <Button
            flex={1}
            size="$3"
            variant="outlined"
            borderColor="$blue8"
            color="$blue11"
            backgroundColor="transparent"
            onPress={onViewRecipes}
            pressStyle={{ backgroundColor: '$blue2' }}
          >
            <Package size={16} marginRight="$1" />
            <Text fontSize="$3" fontWeight="600">Recipes</Text>
          </Button>
          
          <Button
            flex={1}
            size="$3"
            variant="outlined"
            borderColor="$gray8"
            color="$gray11"
            backgroundColor="transparent"
            onPress={onUpdateQty}
            pressStyle={{ backgroundColor: '$gray2' }}
          >
            <Text fontSize="$3" fontWeight="600">Update Qty</Text>
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
} 