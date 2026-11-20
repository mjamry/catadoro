import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { useTheme } from '../../theme/useTheme';
import { SessionInfo } from '../../state/selectors';

const DotSize = 10;

// "● ◐ ○ ○  Focus · 2 of 4": finished sessions filled, the running one half filled, upcoming as rings.
export const getChipLabel = (info: SessionInfo): string => {
  const { phase, focusNumber, sessionsPerCycle, nextPhase } = info;
  const of = `${focusNumber} of ${sessionsPerCycle}`;
  switch (phase) {
    case 'work':
      return `Focus · ${of}`;
    case 'shortBreak':
      return `Break · ${of} done`;
    case 'longBreak':
      return `Long break · ${of} done`;
    default:
      return nextPhase === 'work' ? `Session ${of}` : `Focus · ${of} done`;
  }
};

const SessionChip = ({ info }: { info: SessionInfo }) => {
  const { colors, radius, spacing, elevation } = useTheme();
  const running = info.phase === 'work' ? info.completedFocus + 1 : -1;

  const dots = Array.from({ length: info.sessionsPerCycle }, (_, index) => {
    const number = index + 1;
    const done = number <= info.completedFocus;
    const current = number === running;
    return (
      <View
        key={number}
        style={{
          width: DotSize,
          height: DotSize,
          borderRadius: DotSize / 2,
          borderWidth: 2,
          borderColor: colors.accent,
          backgroundColor: done ? colors.accent : 'transparent',
          overflow: 'hidden',
          marginRight: spacing.xs,
        }}
      >
        {current && <View style={{ width: DotSize / 2 - 2, height: '100%', backgroundColor: colors.accent }} />}
      </View>
    );
  });

  const label = getChipLabel(info);

  return (
    <View
      accessible
      accessibilityLabel={label}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          paddingVertical: spacing.s,
          paddingHorizontal: spacing.l,
          borderRadius: radius.pill,
          backgroundColor: colors.surface,
        },
        elevation.card,
      ]}
    >
      {dots}
      <AppText variant="caption" style={{ marginLeft: spacing.xs }}>{label}</AppText>
    </View>
  );
};

export default SessionChip;
