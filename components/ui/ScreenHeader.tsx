import React from 'react';
import { Pressable, View } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { useTheme } from '../../theme/useTheme';

type ScreenHeaderProps = {
  title: string;
  onBack: () => void;
};

// "‹ Title" header for screens opened from the timer.
const ScreenHeader = ({ title, onBack }: ScreenHeaderProps) => {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 56 }}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}
        style={({ pressed }) => ({ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
      >
        <Icon name="back" size={28} color={colors.text} />
      </Pressable>
      <AppText variant="title" accessibilityRole="header" style={{ marginLeft: spacing.xs }}>{title}</AppText>
    </View>
  );
};

export default ScreenHeader;
