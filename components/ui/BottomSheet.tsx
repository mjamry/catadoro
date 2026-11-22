import React, { useEffect, useState } from 'react';
import { Modal, Pressable, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, ReduceMotion, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AppText from './AppText';
import { useTheme } from '../../theme/useTheme';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  doneLabel?: string;
};

// Slide-up sheet over a dimmed screen (UI-07.1). Closes on Done, a tap on the scrim, or the back button.
const BottomSheet = ({ visible, onClose, title, subtitle, children, doneLabel = 'Done' }: BottomSheetProps) => {
  const { colors, radius, spacing } = useTheme();
  const { height } = useWindowDimensions();
  // Stays mounted until the closing slide has finished.
  const [mounted, setMounted] = useState(visible);
  const shown = useSharedValue(0);

  useEffect(() => {
    const options = { duration: visible ? 260 : 200, easing: Easing.out(Easing.cubic), reduceMotion: ReduceMotion.System };
    if (visible) {
      setMounted(true);
      shown.value = withTiming(1, options);
    } else {
      shown.value = withTiming(0, options, finished => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
  }, [visible]);

  const scrimStyle = useAnimatedStyle(() => ({ opacity: shown.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - shown.value) * height }] }));

  if (!mounted) {
    return null;
  }

  return (
    <Modal transparent visible statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[{ flex: 1, backgroundColor: 'rgba(43,30,22,0.45)' }, scrimStyle]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight: height * 0.85,
            backgroundColor: colors.surface,
            borderTopLeftRadius: radius.xl * 1.5,
            borderTopRightRadius: radius.xl * 1.5,
            paddingHorizontal: spacing.l,
            paddingTop: spacing.s,
            paddingBottom: spacing.xl,
          },
          sheetStyle,
        ]}
      >
        <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.line, marginBottom: spacing.l }} />
        <AppText variant="title" accessibilityRole="header" style={{ marginHorizontal: spacing.s }}>{title}</AppText>
        {subtitle && (
          <AppText variant="body" tone="muted" style={{ marginHorizontal: spacing.s, marginTop: spacing.xs }}>{subtitle}</AppText>
        )}
        <View style={{ marginTop: spacing.m }}>{children}</View>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          style={({ pressed }) => ({
            marginTop: spacing.l,
            minHeight: 56,
            borderRadius: radius.xl,
            backgroundColor: colors.text,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <AppText variant="bodyStrong" style={{ color: colors.surface, fontSize: 18 }}>{doneLabel}</AppText>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

export default BottomSheet;
