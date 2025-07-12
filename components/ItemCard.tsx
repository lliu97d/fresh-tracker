import React, { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Card, Text, XStack, YStack, Button, Stack } from 'tamagui';
import { Calendar, Flame, Package, Clock, AlertTriangle, CheckCircle, Trash2, Minus } from '@tamagui/lucide-icons';

export type FreshnessStatus = 'fresh' | 'watch' | 'expiring' | 'expired';

interface ItemCardProps {
  id: string;
  name: string;
  quantity: number;
  originalQuantity: number;  // Add originalQuantity prop
  unit: string;
  category: string;
  calories: string;
  expiresInDays: number;
  status: FreshnessStatus;
  onViewRecipes?: () => void;
  onUpdateQty?: (id: string, newQuantity: number) => void;
  onDelete?: (id: string) => void;
}

const categoryConfig = {
  Vegetables: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    accentColor: '#2E7D32',
    iconColor: '#4CAF50',
    updateType: 'count',
    decrementAmount: 1,
    unit: 'pcs',
  },
  Fruits: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
    accentColor: '#E65100',
    iconColor: '#FF9800',
    updateType: 'count',
    decrementAmount: 1,
    unit: 'pcs',
  },
  Meat: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
    accentColor: '#C62828',
    iconColor: '#F44336',
    updateType: 'count',
    decrementAmount: 1,
    unit: 'pcs',
  },
  Dairy: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    accentColor: '#1565C0',
    iconColor: '#2196F3',
    updateType: 'percentage',
    decrementAmount: 10,
    unit: '%',
  },
  Bakery: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFC107',
    accentColor: '#F57F17',
    iconColor: '#FFC107',
    updateType: 'count',
    decrementAmount: 1,
    unit: 'pcs',
  },
  Pantry: {
    backgroundColor: '#F3E5F5',
    borderColor: '#9C27B0',
    accentColor: '#6A1B9A',
    iconColor: '#9C27B0',
    updateType: 'percentage',
    decrementAmount: 10,
    unit: '%',
  },
  Condiments: {
    backgroundColor: '#E0F2F1',
    borderColor: '#009688',
    accentColor: '#00695C',
    iconColor: '#009688',
    updateType: 'percentage',
    decrementAmount: 10,
    unit: '%',
  },
  Spices: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF5722',
    accentColor: '#BF360C',
    iconColor: '#FF5722',
    updateType: 'percentage',
    decrementAmount: 10,
    unit: '%',
  },
  Oils: {
    backgroundColor: '#FFFDE7',
    borderColor: '#FFEB3B',
    accentColor: '#F57F17',
    iconColor: '#FFEB3B',
    updateType: 'percentage',
    decrementAmount: 10,
    unit: '%',
  },
  Other: {
    backgroundColor: '#F5F5F5',
    borderColor: '#9E9E9E',
    accentColor: '#424242',
    iconColor: '#9E9E9E',
    updateType: 'count',
    decrementAmount: 1,
    unit: 'pcs',
  },
};

const statusConfig = {
  fresh: {
    backgroundColor: '#4CAF50',
    textColor: 'white',
    icon: CheckCircle,
  },
  watch: {
    backgroundColor: '#FF9800',
    textColor: 'white',
    icon: Clock,
  },
  expiring: {
    backgroundColor: '#F44336',
    textColor: 'white',
    icon: AlertTriangle,
  },
  expired: {
    backgroundColor: '#9E9E9E',
    textColor: 'white',
    icon: AlertTriangle,
  },
};

export default function ItemCard({
  id,
  name,
  quantity,
  originalQuantity,
  unit,
  category,
  calories,
  expiresInDays,
  status,
  onViewRecipes,
  onUpdateQty,
  onDelete,
}: ItemCardProps) {
  const categoryStyle = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.Other;
  const statusStyle = statusConfig[status];
  const StatusIcon = statusStyle.icon;
  
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const deleteButtonOpacity = useRef(new Animated.Value(0)).current;
  const [isSwiped, setIsSwiped] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [isDeleting, setIsDeleting] = useState(false);
  
  let statusText = '';
  if (status === 'fresh') statusText = 'Fresh';
  else if (status === 'watch') statusText = 'Watch';
  else if (status === 'expiring') statusText = 'Expiring';
  else statusText = 'Expired';

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, translationY, velocityX, velocityY } = event.nativeEvent;
      
      // Check if it's more of a horizontal swipe than vertical scroll
      const isHorizontalSwipe = Math.abs(translationX) > Math.abs(translationY) * 2;
      const hasHorizontalVelocity = Math.abs(velocityX) > Math.abs(velocityY);
      
      if (isHorizontalSwipe && hasHorizontalVelocity && translationX < -80) {
        // Swipe left - show delete button
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: -80,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.timing(deleteButtonOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        setIsSwiped(true);
      } else {
        // Swipe right, not enough distance, or vertical scroll - hide delete button
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.timing(deleteButtonOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        setIsSwiped(false);
      }
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const resetPosition = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(deleteButtonOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setIsSwiped(false);
  };

  const handleDecrease = () => {
    let newQuantity;
    if (categoryStyle.updateType === 'percentage') {
      // For percentage-based items, calculate decrement as percentage of original quantity
      const decrementAmount = (categoryStyle.decrementAmount / 100) * originalQuantity;
      newQuantity = Math.max(0, currentQuantity - decrementAmount);
    } else {
      // For count-based items, decrement by fixed amount
      newQuantity = Math.max(0, currentQuantity - categoryStyle.decrementAmount);
    }
    
    setCurrentQuantity(newQuantity);
    
    if (newQuantity <= 0) {
      // Animate deletion when quantity reaches 0
      setIsDeleting(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -300,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Delete the item after animation completes
        if (onDelete) {
          onDelete(id);
        }
      });
    } else {
      // Update quantity if not zero
      if (onUpdateQty) {
        onUpdateQty(id, newQuantity);
      }
    }
  };

  const formatQuantity = () => {
    if (categoryStyle.updateType === 'percentage') {
      const percentage = Math.round((currentQuantity / originalQuantity) * 100);
      return `${percentage}%`;
    } else {
      return `${currentQuantity} ${categoryStyle.unit}`;
    }
  };

  return (
    <YStack marginBottom="$2">
    
      <Animated.View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 60,
          backgroundColor: '#F44336',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          opacity: deleteButtonOpacity, // Use animated opacity for smooth transitions
        }}
      >
        <Button
          size="$3"
          backgroundColor="#F44336"
          borderColor="#D32F2F"
          borderWidth={1}
          borderRadius="$3"
          onPress={handleDelete}
          pressStyle={{ backgroundColor: '#D32F2F' }}
        >
          <Trash2 size={16} color="white" />
        </Button>
      </Animated.View>

      {/* Main Card */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-20, 20]}
        failOffsetY={[-10, 10]}
        shouldCancelWhenOutside={true}
      >
        <Animated.View
          style={{
            transform: [
              { translateX },
              { scale: scaleAnim },
            ],
            opacity: fadeAnim,
            zIndex: 2,
          }}
        >
          <Card
            elevate
            size="$3"
            bordered
            scale={0.98}
            hoverStyle={{ scale: 1.02 }}
            pressStyle={{ scale: 0.96 }}
            backgroundColor={categoryStyle.backgroundColor}
            borderColor={categoryStyle.borderColor}
            borderWidth={1.5}
            padding="$3"
            borderRadius="$4"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
            onPress={resetPosition}
          >
            <YStack space="$3">
              {/* Header with Status Label */}
              <XStack justifyContent="space-between" alignItems="flex-start">
                <YStack flex={1} space="$2">
                  <Text fontSize="$5" fontWeight="700" color="#212121" lineHeight={1.2}>
                    {name}
                  </Text>
                  <Text fontSize="$3" color="#666" fontWeight="500">
                    {quantity} {unit} • {category}
                  </Text>
                </YStack>
                
                {/* Status Badge */}
                <XStack
                  backgroundColor={statusStyle.backgroundColor}
                  paddingHorizontal="$1.5"
                  paddingVertical="$0.5"
                  borderRadius="$2"
                  alignItems="center"
                  space="$1"
                >
                  <StatusIcon size={10} color="white" />
                  <Text fontSize="$1" fontWeight="600" color="white" textTransform="uppercase" letterSpacing={0.3}>
                    {statusText}
                  </Text>
                </XStack>
              </XStack>

              {/* Details with Update Control */}
              <XStack space="$3" alignItems="center">
                <Stack space="$1.5" alignItems="center" flexDirection="row" flex={1}>
                  <Calendar size={16} color={categoryStyle.iconColor} />
                  <YStack>
                    <Text fontSize="$2" color={categoryStyle.accentColor} fontWeight="600">
                      {expiresInDays} {expiresInDays === 1 ? 'day' : 'days'}
                    </Text>
                    <Text fontSize="$1" color="#888" fontWeight="500">
                      remaining
                    </Text>
                  </YStack>
                </Stack>
                
                <Stack space="$1.5" alignItems="center" flexDirection="row" flex={1}>
                  <Flame size={16} color="#FF6B35" />
                  <YStack>
                    <Text fontSize="$2" color="#FF6B35" fontWeight="600">
                      {calories.split(' ')[0]}
                    </Text>
                    <Text fontSize="$1" color="#888" fontWeight="500">
                      calories
                    </Text>
                  </YStack>
                </Stack>
                
                {/* Modern Update Control */}
                <XStack 
                  backgroundColor="white" 
                  borderRadius="$3" 
                  borderWidth={1} 
                  borderColor={categoryStyle.borderColor}
                  alignItems="center"
                  paddingHorizontal="$1"
                  paddingVertical="$0.5"
                  space="$2"
                >
                  <Button
                    size="$1"
                    backgroundColor="transparent"
                    borderColor="transparent"
                    color={categoryStyle.accentColor}
                    borderRadius="$2"
                    padding="$0.5"
                    onPress={handleDecrease}
                    pressStyle={{ 
                      backgroundColor: categoryStyle.backgroundColor,
                      scale: 0.9
                    }}
                    disabled={currentQuantity <= 0}
                    opacity={currentQuantity <= 0 ? 0.5 : 1}
                  >
                    <Minus size={12} color={currentQuantity <= 0 ? "#ccc" : categoryStyle.accentColor} />
                  </Button>
                  
                  <Text fontSize="$2" fontWeight="700" color={categoryStyle.accentColor} minWidth={40} textAlign="center">
                    {formatQuantity()}
                  </Text>
                </XStack>
              </XStack>
            </YStack>
          </Card>
        </Animated.View>
      </PanGestureHandler>
    </YStack>
  );
} 