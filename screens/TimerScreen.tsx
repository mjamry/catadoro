import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, { Easing, ReduceMotion, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Routes } from '../common/Routes';
import { useAppStateStore } from '../state/AppState';
import { useStateMachine } from '../common/StateMachine';
import { useAppSettingsStore } from '../state/AppSettings';
import { useSessionInfo } from '../state/selectors';
import { useTimersStore } from '../state/AppTimers';
import Timer from '../components/Timer';
import Wordmark from '../components/ui/Wordmark';
import TimeDisplay from '../components/ui/TimeDisplay';
import AppText from '../components/ui/AppText';
import IconButton from '../components/IconButton';
import SessionChip from '../components/timer/SessionChip';
import ControlBar from '../components/timer/ControlBar';
import { useTheme } from '../theme/useTheme';
import { breakColors, lightColors } from '../theme/tokens';
import { NavigationProps } from './RootScreenParams';
import ErrorBoundary from '../ErrorBoundary';
import { getCatLine, getMood, moodFace } from '../common/mood';

const minutesLabel = (seconds: number) => `${Math.max(1, Math.round(seconds / 60))} min`;
const phaseName = (phase: string) => (phase === 'longBreak' ? 'long break' : phase === 'shortBreak' ? 'break' : 'focus');
const clock = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const TimerScreen = () => {
  const { spacing, isBreak } = useTheme();
  const { width, height } = useWindowDimensions();
  const nav = useNavigation<NavigationProps>();
  const stateMachine = useStateMachine();
  const info = useSessionInfo();
  const countdown = useAppStateStore(s => s.countdown);
  const totalCountdown = useAppStateStore(s => s.totalCountdown);
  const previousAppState = useAppStateStore(s => s.previousState);
  const keepScreenOn = useAppSettingsStore(s => s.keepScreenOn);
  const catName = useAppSettingsStore(s => s.catName);
  const timers = useTimersStore();

  // Cream ↔ mint background fades over ~400 ms when a break starts or ends (UI-05.2).
  const breakMix = useSharedValue(isBreak ? 1 : 0);
  useEffect(() => {
    breakMix.value = withTiming(isBreak ? 1 : 0, {
      duration: 400,
      easing: Easing.inOut(Easing.quad),
      reduceMotion: ReduceMotion.System,
    });
  }, [isBreak]);
  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(breakMix.value, [0, 1], [lightColors.background, breakColors.background]),
  }));

  useFocusEffect(() => {
    const setup = async () => {
      if(keepScreenOn){
        await activateKeepAwakeAsync();
      }
    }

    setup();
    return() => {
      deactivateKeepAwake();
    }
  });

  const { phase, isPaused, nextPhase } = info;
  const inPhase = phase === 'work' || phase === 'shortBreak' || phase === 'longBreak';
  const running = inPhase && !isPaused;
  const progress = inPhase && totalCountdown > 0 ? (totalCountdown - countdown) / totalCountdown : 0;
  const moodInput = { phase, nextPhase, isPaused, progress, completedFocus: info.completedFocus };
  const face = moodFace[getMood(moodInput)];
  const catLine = getCatLine(moodInput, catName);
  // +5 min is available right after a phase ends (Reset, Skip and +5 min while running come with #80).
  const canExtend = phase === 'idle' && previousAppState !== undefined && previousAppState !== 'idle';

  // Mascot sized to the screen so everything fits on small phones (360 x 640) without scrolling.
  const mascotWidth = Math.min(width - spacing.xxl * 2, height * 0.36, 340);

  // After a long break a new cycle starts at focus 1.
  const upcomingFocus = phase === 'longBreak' || nextPhase === 'longBreak'
    ? 1
    : Math.min(info.completedFocus + 1, info.sessionsPerCycle);

  const footer = (() => {
    if (inPhase && info.endsAt) {
      const next = info.nextPhase === 'work'
        ? `focus ${upcomingFocus} of ${info.sessionsPerCycle} · ${minutesLabel(info.nextPhaseSeconds)}`
        : `${minutesLabel(info.nextPhaseSeconds)} ${phaseName(nextPhase)}`;
      return isPaused ? `Next: ${next}` : `Next: ${next} · ends ${clock(info.endsAt)}`;
    }
    if (nextPhase === 'work') {
      const breakAfter = info.focusNumber >= info.sessionsPerCycle
        ? `${timers.longBreak} min long break`
        : `${timers.shortBreak} min break`;
      return `Then: ${breakAfter}`;
    }
    return `Then: focus ${upcomingFocus} of ${info.sessionsPerCycle} · ${timers.work} min`;
  })();

  return (
    <ErrorBoundary>
      <Animated.View
        style={[
          {
            flex: 1,
            paddingTop: Constants.statusBarHeight + spacing.s,
            paddingHorizontal: spacing.l,
            paddingBottom: spacing.l,
          },
          backgroundStyle,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ paddingLeft: spacing.s }}>
            <Wordmark size={28} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            {/* Statistics screen arrives with #86. */}
            <IconButton size="small" type="stats" onPress={() => {}} disabled accessibilityLabel="Statistics (coming soon)" />
            <IconButton size="small" type="settings" onPress={() => nav.navigate(Routes.settings)} />
          </View>
        </View>

        <View style={{ marginTop: spacing.m }}>
          <SessionChip info={info} />
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Timer width={mascotWidth} face={face} />
          <View style={{ marginTop: spacing.l }}>
            <TimeDisplay seconds={inPhase ? countdown : info.nextPhaseSeconds} size={Math.min(76, width * 0.18)} />
          </View>
          <AppText variant="body" tone="muted" align="center" style={{ marginTop: spacing.xs }}>
            {catLine.name && <AppText variant="bodyStrong">{catLine.name}: </AppText>}
            {'“' + catLine.line + '”'}
          </AppText>
        </View>

        <ControlBar
          phase={phase}
          running={running}
          canExtend={canExtend}
          onPlay={() => stateMachine.run()}
          onPause={() => stateMachine.pause()}
          onExtend={() => stateMachine.extend()}
        />

        <AppText variant="caption" tone="muted" align="center" style={{ marginTop: spacing.m }}>
          {footer}
        </AppText>
      </Animated.View>
    </ErrorBoundary>
  );
};

export default TimerScreen;
