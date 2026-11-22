import React, { useRef, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import ErrorBoundary from '../../ErrorBoundary';
import ScreenHeader from '../../components/ui/ScreenHeader';
import AppText from '../../components/ui/AppText';
import Stepper from '../../components/ui/Stepper';
import Toggle from '../../components/ui/Toggle';
import { ListGroup, ListRow, ListValue, SectionHeader } from '../../components/ui/List';
import SoundSheet, { soundName } from '../../components/settings/SoundSheet';
import { useTheme } from '../../theme/useTheme';
import { fonts } from '../../theme/fonts';
import { useTimersStore } from '../../state/AppTimers';
import { useAppSettingsStore } from '../../state/AppSettings';
import { useNotificationChannelIdStore } from '../../state/AppNotifications';
import { useEnvironmentStore } from '../../state/Environment';
import { CatNameMaxLength } from '../../common/mood';
import { Routes } from '../../common/Routes';
import useUseShareLogs from '../../common/ShareLogsButton';
import { NavigationProps } from '../RootScreenParams';

// Step limits for the timer rows.
export const TimerLimits = {
  work: { min: 5, max: 90, step: 5 },
  shortBreak: { min: 1, max: 15, step: 1 },
  longBreak: { min: 5, max: 45, step: 5 },
  sessionsPerCycle: { min: 2, max: 8, step: 1 },
} as const;

const DebugTaps = 7;
const DebugTapWindowMs = 3000;

const About = 'Made so that while you work for the kitty grub, you still make time to play and rest. A happy cat means a happier you.';

// One scrollable, grouped settings list (UI-06). Rows for features that are not built yet
// (daily goal, auto-start, vibrate, appearance) are added with those features.
export const SettingsScreen = () => {
  const { colors, radius, spacing } = useTheme();
  const nav = useNavigation<NavigationProps>();
  const share = useUseShareLogs();
  const buildType = useEnvironmentStore(s => s.buildType);

  const work = useTimersStore(s => s.work);
  const shortBreak = useTimersStore(s => s.shortBreak);
  const longBreak = useTimersStore(s => s.longBreak);
  const setWork = useTimersStore(s => s.setWork);
  const setShortBreak = useTimersStore(s => s.setShortBreak);
  const setLongBreak = useTimersStore(s => s.setLongBreak);
  const sessionsPerCycle = useAppSettingsStore(s => s.sessionsPerCycle);
  const setSessionsPerCycle = useAppSettingsStore(s => s.setSessionsPerCycle);
  const keepScreenOn = useAppSettingsStore(s => s.keepScreenOn);
  const setKeepScreenOn = useAppSettingsStore(s => s.setKeepScreenOn);
  const catName = useAppSettingsStore(s => s.catName);
  const setCatName = useAppSettingsStore(s => s.setCatName);
  const sound = useNotificationChannelIdStore(s => s.notificationChannelId);

  const [soundSheet, setSoundSheet] = useState(false);

  // Debug opens after tapping the version row 7 times in a row (UI-06.7).
  const taps = useRef<number[]>([]);
  const onVersionTap = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter(t => now - t < DebugTapWindowMs), now];
    if (taps.current.length >= DebugTaps) {
      taps.current = [];
      nav.navigate(Routes.debug);
    }
  };

  const version = Constants.expoConfig?.version ?? '';
  const runtime = Constants.expoConfig?.runtimeVersion;
  const versionDetails = buildType !== 'PROD'
    ? `${buildType} · runtime ${typeof runtime === 'string' ? runtime : '?'}`
    : undefined;

  return (
    <ErrorBoundary>
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: Constants.statusBarHeight + spacing.s }}>
        <View style={{ paddingHorizontal: spacing.s }}>
          <ScreenHeader title="Settings" onBack={() => nav.goBack()} />
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.l, paddingBottom: spacing.xxl }}>
          <SectionHeader title="Timer" />
          <ListGroup>
            <ListRow
              icon="clock"
              title="Focus"
              subtitle="Classic is 25"
              trailing={<Stepper label="Focus" unit="min" value={work} onChange={setWork} {...TimerLimits.work} />}
            />
            <ListRow
              icon="coffee"
              tone="break"
              title="Short break"
              subtitle="After each focus"
              trailing={<Stepper label="Short break" unit="min" value={shortBreak} onChange={setShortBreak} {...TimerLimits.shortBreak} />}
            />
            <ListRow
              icon="sofa"
              tone="break"
              title="Long break"
              subtitle={`After ${sessionsPerCycle} sessions`}
              trailing={<Stepper label="Long break" unit="min" value={longBreak} onChange={setLongBreak} {...TimerLimits.longBreak} />}
            />
            <ListRow
              icon="repeat"
              title="Sessions"
              subtitle="Before a long break"
              trailing={<Stepper label="Sessions before a long break" value={sessionsPerCycle} onChange={setSessionsPerCycle} {...TimerLimits.sessionsPerCycle} />}
            />
          </ListGroup>

          <SectionHeader title="Your cat" />
          <ListGroup>
            <ListRow
              icon="cat"
              title="Name"
              subtitle="Signs its lines"
              trailing={
                <TextInput
                  value={catName}
                  onChangeText={setCatName}
                  onEndEditing={() => setCatName(catName.trim())}
                  placeholder="e.g. Mochi"
                  placeholderTextColor={colors.textDisabled}
                  maxLength={CatNameMaxLength}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="done"
                  accessibilityLabel="Your cat's name"
                  style={{
                    width: 120,
                    minHeight: 44,
                    paddingHorizontal: spacing.m,
                    borderRadius: radius.l,
                    backgroundColor: colors.surfaceMuted,
                    color: colors.text,
                    fontFamily: fonts.bodyBold,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                />
              }
            />
          </ListGroup>

          <SectionHeader title="Behaviour" />
          <ListGroup>
            <ListRow
              icon="sun"
              title="Keep screen on"
              subtitle="While the timer runs"
              trailing={<Toggle label="Keep screen on" value={keepScreenOn} onChange={setKeepScreenOn} />}
            />
          </ListGroup>

          <SectionHeader title="Alerts" />
          <ListGroup>
            <ListRow
              icon="bell"
              title="Sound"
              onPress={() => setSoundSheet(true)}
              accessibilityLabel={`Sound, ${soundName(sound)}`}
              accessibilityHint="Opens the sound picker"
              trailing={<ListValue value={soundName(sound)} />}
            />
          </ListGroup>

          <SectionHeader title="About" />
          <ListGroup>
            <ListRow
              icon="info"
              title={`Version ${version}`}
              subtitle={versionDetails}
              onPress={onVersionTap}
              accessibilityHint="Tap 7 times to open the debug screen"
            />
            <ListRow icon="share" title="Share logs" onPress={() => share()} trailing={<ListValue value="" />} />
          </ListGroup>
          <AppText variant="caption" tone="muted" align="center" style={{ marginTop: spacing.l, marginHorizontal: spacing.l }}>
            {About}
          </AppText>
        </ScrollView>
      </View>
      <SoundSheet visible={soundSheet} onClose={() => setSoundSheet(false)} />
    </ErrorBoundary>
  );
};
