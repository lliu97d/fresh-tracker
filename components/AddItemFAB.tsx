import React, { useState } from 'react';
import { Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Button } from 'tamagui';
import { Barcode, Edit3 } from '@tamagui/lucide-icons';
import FAB from './FAB';

interface AddItemFABProps {
  onScanBarcode: () => void;
  onManualEntry: () => void;
  style?: any;
}

export default function AddItemFAB({ onScanBarcode, onManualEntry, style }: AddItemFABProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleOption = (option: 'scan' | 'manual') => {
    setModalVisible(false);
    if (option === 'scan') onScanBarcode();
    else onManualEntry();
  };

  return (
    <>
      <FAB onPress={() => setModalVisible(true)} style={style} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0,0,0,0.2)', 
            justifyContent: 'flex-end' 
          }} 
          onPress={() => setModalVisible(false)}
        >
          <YStack
            backgroundColor="$background"
            borderTopLeftRadius="$6"
            borderTopRightRadius="$6"
            paddingTop="$4"
            paddingBottom={Math.max(insets.bottom, 40)}
            paddingHorizontal="$5"
            alignItems="center"
            onPress={() => {}}
          >
            <YStack
              width={40}
              height={4}
              backgroundColor="$gray8"
              borderRadius="$2"
              marginBottom="$4"
            />
            
            <YStack space="$4" alignItems="center" width="100%">
              <Text fontSize="$6" fontWeight="bold" color="$color" textAlign="center">
                Add New Item
              </Text>
              
              <YStack space="$3" width="100%">
                <Button
                  size="$4"
                  backgroundColor="$blue2"
                  borderColor="$blue8"
                  borderWidth={1}
                  borderRadius="$4"
                  paddingVertical="$4"
                  onPress={() => handleOption('scan')}
                  pressStyle={{ backgroundColor: '$blue3' }}
                >
                  <XStack space="$3" alignItems="center" justifyContent="center">
                    <Barcode size={24} color="$blue9" />
                    <Text fontSize="$4" fontWeight="600" color="$blue11">
                      Scan Barcode
                    </Text>
                  </XStack>
                </Button>
                
                <Button
                  size="$4"
                  backgroundColor="$gray2"
                  borderColor="$gray8"
                  borderWidth={1}
                  borderRadius="$4"
                  paddingVertical="$4"
                  onPress={() => handleOption('manual')}
                  pressStyle={{ backgroundColor: '$gray3' }}
                >
                  <XStack space="$3" alignItems="center" justifyContent="center">
                    <Edit3 size={24} color="$gray9" />
                    <Text fontSize="$4" fontWeight="600" color="$gray11">
                      Manual Entry
                    </Text>
                  </XStack>
                </Button>
              </YStack>
            </YStack>
          </YStack>
        </Pressable>
      </Modal>
    </>
  );
}