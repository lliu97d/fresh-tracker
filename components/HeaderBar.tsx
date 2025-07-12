import React from 'react';
import { SafeAreaView } from 'react-native';
import { XStack, YStack, Text } from 'tamagui';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export default function HeaderBar({ title, subtitle, rightElement }: HeaderBarProps) {
  return (
    <SafeAreaView>
      <YStack backgroundColor="$background">
        <YStack
          backgroundColor="$background"
          borderBottomColor="$borderColor"
          borderBottomWidth={1}
          paddingHorizontal="$5"
          paddingTop="$2"
          paddingBottom="$4"
        >
          <XStack alignItems="center" justifyContent="space-between">
            <YStack flex={1} alignItems="center">
              <Text
                fontSize="$8"
                fontWeight="bold"
                color="$color"
                textAlign="center"
              >
                {title}
              </Text>
          {subtitle && (
                <Text
                  fontSize="$3"
                  color="$gray10"
                  marginTop="$1"
                  textAlign="center"
                >
                  {subtitle}
                </Text>
          )}
            </YStack>
        {rightElement && (
              <YStack position="absolute" right={0} top="$2">
            {rightElement}
              </YStack>
        )}
          </XStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}