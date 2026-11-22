import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { Easing, ReduceMotion, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../theme/useTheme';

type ToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

const TrackWidth = 52;
const TrackHeight = 32;
const Thumb = 26;
const Inset = (TrackHeight - Thumb) / 2;

// On/off switch in theme colours (UI-06.4).
const Toggle = ({ value, onChange, label }: ToggleProps) => {
  const { colors } = useTheme();
  const on = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    on.value = withTiming(value ? 1 : 0, { duration: 160, easing: Easing.out(Easing.quad), reduceMotion: ReduceMotion.System });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(on.value, [0, 1], [colors.line, colors.accent]),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: on.value * (TrackWidth - Thumb - Inset * 2) }],
  }));

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={8}
    >
      <Animated.View style={[{ width: TrackWidth, height: TrackHeight, borderRadius: TrackHeight / 2, padding: Inset }, trackStyle]}>
        <Animated.View
          style={[
            { width: Thumb, height: Thumb, borderRadius: Thumb / 2, backgroundColor: colors.surface, elevation: 2 },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

export default Toggle;
