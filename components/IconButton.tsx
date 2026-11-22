import React from 'react';
import { Pressable, View } from 'react-native';
import Icon, { IconName, iconLabels } from './ui/Icon';
import { useTheme } from '../theme/useTheme';

type Size = 'small' | 'medium' | 'large';

type IconProps = {
  size: Size;
  type: IconName;
  onPress: () => void;
  disabled?: boolean;
  backgroundColor?: string;
  // Primary buttons are filled with the accent colour (play/pause).
  variant?: 'default' | 'primary';
  accessibilityLabel?: string;
};

const dimensions: Record<Size, { button: number; icon: number }> = {
  small: { button: 44, icon: 20 },
  medium: { button: 56, icon: 24 },
  large: { button: 72, icon: 30 },
};

// Round button with a line icon. Plain views instead of Skia drawing (lighter, no contour artefacts).
const IconButton = (props: IconProps) => {
  const { colors, elevation } = useTheme();
  const { button, icon } = dimensions[props.size];
  const isPrimary = props.variant === 'primary';

  const background = props.backgroundColor ?? (isPrimary ? colors.accent : colors.surface);
  const iconColor = props.disabled
    ? colors.textDisabled
    : isPrimary ? colors.onAccent : colors.text;

  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? iconLabels[props.type]}
      accessibilityState={{ disabled: !!props.disabled }}
      hitSlop={Math.max(0, (48 - button) / 2)}
      style={({ pressed }) => ({
        margin: 4,
        transform: [{ scale: pressed ? 0.94 : 1 }],
        opacity: props.disabled ? 0.6 : 1,
      })}
    >
      <View
        style={[
          {
            width: button,
            height: button,
            borderRadius: button / 2,
            backgroundColor: background,
            alignItems: 'center',
            justifyContent: 'center',
          },
          props.disabled ? null : elevation.card,
        ]}
      >
        <Icon name={props.type} size={icon} color={iconColor} />
      </View>
    </Pressable>
  );
};

export default IconButton;
