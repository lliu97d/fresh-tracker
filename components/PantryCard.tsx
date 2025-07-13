import React, { useState, useRef } from 'react';
import { Animated, Modal, Pressable } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Card, Text, XStack, YStack, Button, Stack } from 'tamagui';
import { Calendar, Package, Clock, AlertTriangle, CheckCircle, Trash2, Minus, Info, Archive } from '@tamagui/lucide-icons';

export type FreshnessStatus = 'fresh' | 'watch' | 'expiring' | 'expired';

interface PantryCardProps {
  id: string;
  name: string;
  quantity: number;
  originalQuantity: number;
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

// Storage suggestions for pantry items
const storageSuggestions: Record<string, { title: string; tips: string[] }> = {
  Pantry: {
    title: "Pantry Storage Tips",
    tips: [
      "Store in a cool, dry, dark place",
      "Use airtight containers to prevent pests",
      "Keep away from heat sources",
      "Rotate stock (first in, first out)",
      "Check for expiration dates regularly"
    ]
  },
  Condiments: {
    title: "Condiment Storage Tips",
    tips: [
      "Most condiments can be stored in the refrigerator",
      "Check labels for specific storage instructions",
      "Keep opened condiments refrigerated",
      "Store in original containers when possible",
      "Discard if mold appears or smell changes"
    ]
  },
  Spices: {
    title: "Spice Storage Tips",
    tips: [
      "Store in a cool, dark, dry place",
      "Keep away from heat and sunlight",
      "Use airtight containers",
      "Replace spices every 1-2 years",
      "Store whole spices longer than ground spices"
    ]
  },
  Oils: {
    title: "Oil Storage Tips",
    tips: [
      "Store in a cool, dark place",
      "Keep away from heat and light",
      "Use airtight containers",
      "Refrigerate nut oils to extend shelf life",
      "Check for rancid smell before using"
    ]
  },
  Other: {
    title: "General Storage Tips",
    tips: [
      "Follow package storage instructions",
      "Keep in a cool, dry place",
      "Check expiration dates regularly",
      "Store in airtight containers when possible",
      "When in doubt, refrigerate"
    ]
  }
};

export default function PantryCard({
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
}: PantryCardProps) {
  const getUpdateType = () => {
    // Determine update type based on unit
    const percentageUnits = ['g', 'kg', 'ml', 'L', 'lb', 'oz', 'gallon', 'bottle', 'cup', 'tbsp', 'tsp'];
    const countUnits = ['pcs', 'pieces', 'item', 'bag', 'box', 'pack', 'can', 'jar'];
    
    const normalizedUnit = unit.toLowerCase();
    
    if (percentageUnits.includes(normalizedUnit)) {
      return {
        updateType: 'percentage',
        decrementAmount: 10,
        displayUnit: '%'
      };
    } else if (countUnits.includes(normalizedUnit)) {
      return {
        updateType: 'count',
        decrementAmount: 1,
        displayUnit: 'pcs'
      };
    } else {
      // Default to count-based for unknown units
      return {
        updateType: 'count',
        decrementAmount: 1,
        displayUnit: 'pcs'
      };
    }
  };

  const updateConfig = getUpdateType();
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
  const [showStorageTips, setShowStorageTips] = useState(false);
  
  let statusText = '';
  if (status === 'fresh') statusText = 'Good';
  else if (status === 'watch') statusText = 'Check';
  else if (status === 'expiring') statusText = 'Soon';
  else statusText = 'Expired';

  // Get storage suggestions for this food category
  const storageInfo = storageSuggestions[category] || storageSuggestions.Other;

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
    if (updateConfig.updateType === 'percentage') {
      // For percentage-based items, calculate decrement as percentage of original quantity
      const decrementAmount = (updateConfig.decrementAmount / 100) * originalQuantity;
      newQuantity = Math.max(0, currentQuantity - decrementAmount);
    } else {
      // For count-based items, decrement by fixed amount
      newQuantity = Math.max(0, currentQuantity - updateConfig.decrementAmount);
    }
    
    setCurrentQuantity(newQuantity);
    
    // Check if quantity is effectively zero (using a small threshold for percentage-based items)
    const isEffectivelyZero = updateConfig.updateType === 'percentage' 
      ? newQuantity < 0.01  // Consider less than 0.01 as effectively zero
      : newQuantity <= 0;
    
    if (isEffectivelyZero) {
      // Animate deletion when quantity reaches effectively zero
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
      // Update quantity if not effectively zero
      if (onUpdateQty) {
        onUpdateQty(id, newQuantity);
      }
    }
  };

  const formatQuantityDisplay = () => {
    if (updateConfig.updateType === 'percentage') {
      // For percentage-based items, show quantity with max 2 decimal places
      const quantity = currentQuantity || 0;
      // If it's an integer greater than 10, show as whole number
      if (quantity >= 10 && Number.isInteger(quantity)) {
        return `${Math.round(quantity)} ${unit}`;
      }
      return `${quantity.toFixed(2)} ${unit}`;
    } else {
      // For count-based items, show as integer
      return `${Math.round(currentQuantity || 0)} ${unit}`;
    }
  };

  return (
    <YStack marginBottom={12}>
      <Animated.View
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 0,
          borderRadius: 16,
        }}
      >
        <Card
          backgroundColor="#FFF"
          borderRadius={16}
          padding={16}
          borderWidth={0}
          shadowColor="#000"
          shadowOpacity={0.05}
          shadowRadius={8}
          elevation={0}
        >
          <YStack space={10}>
            {/* Header with name and status */}
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize={17} fontWeight="600" color="#222" numberOfLines={2} ellipsizeMode="tail" flex={1}>
                {name}
              </Text>
              <XStack
                backgroundColor={categoryStyle.backgroundColor}
                borderRadius={10}
                paddingHorizontal={8}
                paddingVertical={3}
                alignItems="center"
                space={3}
              >
                <StatusIcon size={12} color={categoryStyle.accentColor} />
                <Text fontSize={11} color={categoryStyle.accentColor} fontWeight="500">
                  {statusText}
                </Text>
              </XStack>
            </XStack>
            
            {/* Quantity and category */}
            <Text fontSize={14} color="#666" fontWeight="500">
              {formatQuantityDisplay()} • {category}
            </Text>
            
            {/* Pantry-specific info row */}
            <XStack space={12} alignItems="center">
              <Archive size={14} color={categoryStyle.iconColor} />
              <Text fontSize={13} color={categoryStyle.accentColor} fontWeight="500">
                {expiresInDays} {expiresInDays === 1 ? 'day' : 'days'} left
              </Text>
              <Package size={14} color="#FF6B35" />
              <Text fontSize={13} color="#FF6B35" fontWeight="500">
                {calories.split(' ')[0]} cal
              </Text>
            </XStack>
            
            {/* Action buttons */}
            <XStack space={8} alignItems="center">
              <Button
                backgroundColor={categoryStyle.backgroundColor}
                borderRadius={14}
                paddingHorizontal={10}
                paddingVertical={5}
                onPress={handleDecrease}
                pressStyle={{ backgroundColor: categoryStyle.borderColor, opacity: 0.8 }}
                disabled={currentQuantity <= 0}
                opacity={currentQuantity <= 0 ? 0.5 : 1}
              >
                <Minus size={14} color={categoryStyle.accentColor} />
              </Button>
              {/* Info button for storage tips */}
              <Button
                backgroundColor="#F0F7FA"
                borderRadius={14}
                paddingHorizontal={10}
                paddingVertical={5}
                onPress={() => setShowStorageTips(true)}
                pressStyle={{ backgroundColor: '#E0F2F1' }}
              >
                <Info size={14} color="#388E3C" />
              </Button>
              {/* Delete button */}
              <Button
                backgroundColor="#FFEBEE"
                borderRadius={14}
                paddingHorizontal={10}
                paddingVertical={5}
                onPress={handleDelete}
                pressStyle={{ backgroundColor: '#FFCDD2' }}
              >
                <Trash2 size={14} color="#EF5350" />
              </Button>
            </XStack>
          </YStack>
        </Card>
      </Animated.View>
      
      {/* Storage Tips Modal */}
      <Modal
        visible={showStorageTips}
        onRequestClose={() => setShowStorageTips(false)}
        transparent
        animationType="fade"
      >
        <Pressable style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowStorageTips(false)}>
          <Card
            elevate
            size="$4"
            bordered
            scale={0.95}
            hoverStyle={{ scale: 1.02 }}
            pressStyle={{ scale: 0.96 }}
            backgroundColor="white"
            borderColor="#ccc"
            borderWidth={1}
            padding="$5"
            borderRadius="$4"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={10}
            maxWidth={400}
            minWidth={320}
          >
            <Text fontSize="$6" fontWeight="bold" color="#212121" marginBottom="$4" textAlign="center">
              {storageInfo.title}
            </Text>
            <YStack space="$3" marginBottom="$4">
              {storageInfo.tips.map((tip, index) => (
                <XStack key={index} space="$3" alignItems="flex-start">
                  <Text fontSize="$2" color="#666" marginTop="$1">•</Text>
                  <Text fontSize="$4" color="#444" flex={1} lineHeight={15} fontWeight="500">
                    {tip}
                  </Text>
                </XStack>
              ))}
            </YStack>
            <Button
              size="$4"
              backgroundColor={categoryStyle.accentColor}
              borderColor={categoryStyle.accentColor}
              borderWidth={1}
              borderRadius="$4"
              paddingVertical="$3"
              onPress={() => setShowStorageTips(false)}
              pressStyle={{ backgroundColor: categoryStyle.accentColor, opacity: 0.9 }}
            >
              <Text color="white" fontWeight="600" fontSize="$4">Close</Text>
            </Button>
          </Card>
        </Pressable>
      </Modal>
    </YStack>
  );
} 