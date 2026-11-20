import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Routes } from '../common/Routes';
import NavigationButton from '../components/NavigationButton';
import Constants from 'expo-constants';
import { useTheme } from '../theme/useTheme';
import TextWithShadow from '../components/TextWithShadow';
import IconButton from '../components/IconButton';
import { useEnvironmentStore } from '../state/Environment';
import { useNavigation } from '@react-navigation/native';
import useUseShareLogs from '../common/ShareLogsButton';
import { NavigationProps } from './RootScreenParams';
import Mascot from '../components/mascot/Mascot';
import { palette } from '../theme/tokens';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: Constants.statusBarHeight + 50
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  }
});

type Props = {
  error?: string;
}

const ErrorScreen = (props: Props) => {
  const background = useTheme().colors.background;
  const buildType = useEnvironmentStore(s => s.buildType);
  const nav = useNavigation<NavigationProps>();
  const share = useUseShareLogs();


  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <NavigationButton icon={'clock'} route={Routes.home} />
      <Mascot width={140} face="angry" progress={0} progressColor={palette.tomato} />
      <TextWithShadow value={'Ups...'}></TextWithShadow>
      <TextWithShadow value={'Houston, we have a problem'} fontSize={12}></TextWithShadow>
      <View style={styles.row}>
        <IconButton size={'small'} type={'share'} onPress={() => share()} />
        {buildType !== 'PROD' && <IconButton size={'small'} type={'bug'} onPress={() => nav.navigate(Routes.debug)} />}
      </View>
      {buildType !== 'PROD' && <View>
        <Text>{props.error}</Text>
      </View>}
    </View>
  );

};

export default ErrorScreen;
