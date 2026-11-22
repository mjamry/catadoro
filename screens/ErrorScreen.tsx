import React from 'react';
import { View } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../common/Routes';
import { useTheme } from '../theme/useTheme';
import IconButton from '../components/IconButton';
import AppText from '../components/ui/AppText';
import { useEnvironmentStore } from '../state/Environment';
import useUseShareLogs from '../common/ShareLogsButton';
import { NavigationProps } from './RootScreenParams';
import Mascot from '../components/mascot/Mascot';
import { palette } from '../theme/tokens';

type Props = {
  error?: string;
}

const ErrorScreen = (props: Props) => {
  const { colors, spacing } = useTheme();
  const buildType = useEnvironmentStore(s => s.buildType);
  const nav = useNavigation<NavigationProps>();
  const share = useUseShareLogs();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        paddingTop: Constants.statusBarHeight,
        paddingHorizontal: spacing.xl,
      }}
    >
      <Mascot width={140} face="angry" progress={0} progressColor={palette.tomato} />
      <AppText variant="title" align="center" style={{ marginTop: spacing.l }}>Oops…</AppText>
      <AppText variant="body" tone="muted" align="center" style={{ marginTop: spacing.xs }}>
        Something went wrong. Sharing the logs helps fix it.
      </AppText>
      <View style={{ flexDirection: 'row', marginTop: spacing.l }}>
        <IconButton size="medium" type="clock" onPress={() => nav.navigate(Routes.home)} accessibilityLabel="Back to the timer" />
        <IconButton size="medium" type="share" onPress={() => share()} />
        {buildType !== 'PROD' && <IconButton size="medium" type="bug" onPress={() => nav.navigate(Routes.debug)} />}
      </View>
      {buildType !== 'PROD' && props.error && (
        <AppText variant="caption" tone="muted" style={{ marginTop: spacing.l }}>{props.error}</AppText>
      )}
    </View>
  );
};

export default ErrorScreen;
