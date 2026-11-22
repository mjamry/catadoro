import React from 'react';
import { View } from 'react-native';
import IconButton from '../IconButton';
import AppText from '../ui/AppText';
import { IconName } from '../ui/Icon';
import { useTheme } from '../../theme/useTheme';

type ControlButtonProps = {
  icon: IconName;
  label?: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
  // Defaults to the label (the primary button has no caption, so it passes its own).
  accessibilityLabel?: string;
};

// Round control with a caption underneath (Reset, +5 min, Skip). The primary one has no caption.
const ControlButton = ({ icon, label, onPress, primary, disabled, accessibilityLabel }: ControlButtonProps) => {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', width: primary ? 104 : 80 }}>
      <IconButton
        size={primary ? 'large' : 'medium'}
        variant={primary ? 'primary' : 'default'}
        type={icon}
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel ?? label}
      />
      {label !== undefined && (
        <AppText
          variant="label"
          tone="muted"
          style={{ marginTop: 4, color: disabled ? colors.textDisabled : colors.textMuted }}
        >
          {label}
        </AppText>
      )}
    </View>
  );
};

export default ControlButton;
