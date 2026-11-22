import React, { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { useTheme } from '../../theme/useTheme';
import { fonts } from '../../theme/fonts';

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  // Spoken name, e.g. "Focus".
  label: string;
};

const RepeatDelay = 500;
const RepeatInterval = 110;

export const clampStep = (value: number, delta: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value + delta));

// − value unit + (UI-06.3). Holding a button keeps stepping. Replaces the old sliders.
const Stepper = ({ value, onChange, min, max, step = 1, unit, label }: StepperProps) => {
  const { colors, radius, spacing } = useTheme();
  // The latest value is kept in a ref so a held button keeps counting from where it is.
  const current = useRef(value);
  current.current = value;
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const stop = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  };
  useEffect(() => stop, []);

  const change = (delta: number) => {
    const next = clampStep(current.current, delta, min, max);
    if (next === current.current) {
      stop();
      return;
    }
    current.current = next;
    onChange(next);
  };

  const start = (delta: number) => {
    stop();
    change(delta);
    const repeat = () => {
      change(delta);
      timer.current = setTimeout(repeat, RepeatInterval);
    };
    timer.current = setTimeout(repeat, RepeatDelay);
  };

  const button = (delta: number) => {
    const disabled = delta < 0 ? value <= min : value >= max;
    return (
      <Pressable
        onPressIn={() => start(delta)}
        onPressOut={stop}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${delta < 0 ? 'Decrease' : 'Increase'} ${label}`}
        accessibilityState={{ disabled }}
        hitSlop={4}
        style={({ pressed }) => ({
          width: 36,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radius.pill,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Icon name={delta < 0 ? 'minus' : 'plus'} size={20} color={disabled ? colors.textDisabled : colors.text} />
      </Pressable>
    );
  };

  return (
    <View
      accessible={false}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceMuted,
        borderRadius: radius.l,
        paddingHorizontal: 2,
      }}
    >
      {button(-step)}
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ text: `${value}${unit ? ' ' + unit : ''}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={e => change(e.nativeEvent.actionName === 'increment' ? step : -step)}
        style={{ minWidth: 48, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}
      >
        <AppText style={{ fontFamily: fonts.displayBold, fontSize: 19, lineHeight: 26 }}>{value}</AppText>
        {unit && <AppText variant="caption" tone="muted" style={{ marginLeft: 3 }}>{unit}</AppText>}
      </View>
      {button(step)}
    </View>
  );
};

export default Stepper;
