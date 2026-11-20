import React, { useEffect } from 'react';
import { Easing, ReduceMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { AppState, useAppStateStore } from '../state/AppState';
import { useTheme } from '../theme/useTheme';
import Mascot from './mascot/Mascot';
import { FaceName } from './mascot/mascotPaths';

type TimerProps = {
  width: number;
  paused?: boolean;
};

// Face follows the phase: sleepy when idle, focused, judgy near the end, happy on a break, sad when paused.
export const getFace = (state: AppState | undefined, progress: number, paused: boolean): FaceName => {
  if (state === undefined || state === 'idle') {
    return 'squint';
  }
  if (paused) {
    return 'sad';
  }
  if (state !== 'work') {
    return 'happy';
  }
  return progress >= 0.75 ? 'angry' : 'normal';
};

const Timer = ({ width, paused = false }: TimerProps) => {
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
      face={getFace(currentState, elapsed, paused)}
      progress={progress}
      progressColor={colors.accent}
    />
  );
};

export default Timer;
