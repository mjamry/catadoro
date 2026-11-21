import React, { useEffect } from 'react';
import { Easing, ReduceMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppStateStore } from '../state/AppState';
import { useTheme } from '../theme/useTheme';
import Mascot from './mascot/Mascot';
import { FaceName } from './mascot/mascotPaths';

type TimerProps = {
  width: number;
  // The cat's mood face, picked by common/mood.ts (#98).
  face: FaceName;
};

const Timer = ({ width, face }: TimerProps) => {
  const { colors } = useTheme();
  const countdown = useAppStateStore(s => s.countdown);
  const totalCountdown = useAppStateStore(s => s.totalCountdown);
  const currentState = useAppStateStore(s => s.currentState);
  const progress = useSharedValue(0);

  const isRunningPhase = currentState !== undefined && currentState !== 'idle';
  const elapsed = isRunningPhase && totalCountdown > 0
    ? Math.min(1, Math.max(0, (totalCountdown - countdown) / totalCountdown))
    : 0;

  useEffect(() => {
    if (elapsed === 0) {
      progress.value = 0;
      return;
    }
    progress.value = withTiming(elapsed, {
      duration: 1000,
      easing: Easing.linear,
      reduceMotion: ReduceMotion.System,
    });
  }, [elapsed]);

  return (
    <Mascot
      width={width}
      face={face}
      progress={progress}
      progressColor={colors.accent}
    />
  );
};

export default Timer;
