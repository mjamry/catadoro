
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Button, Platform, AppState } from 'react-native';
import IconButton from '../components/IconButton';
import { Routes } from '../common/Routes';

import { useAppStateStore } from '../state/AppState';
import { useStateMachine } from '../common/StateMachine';
import Timer from '../components/Timer';
import TextWithShadow from '../components/TextWithShadow';
import { useColorsStore } from '../state/AppColors';
import NavigationButton from '../components/NavigationButton';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useAppSettingsStore } from '../state/AppSettings';
import ErrorBoundary from '../ErrorBoundary';

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

const TimerScreen = () => {
  const countdownLeft = useAppStateStore(s => s.countdown);
  const appState = useAppStateStore(s => s.currentState);
  const previousAppState = useAppStateStore(s => s.previousState);
  const stateMachine = useStateMachine();
  const background = useColorsStore(s => s.background);
  const [isPaused, setIsPaused] = useState(true);
  const keepScreenOn = useAppSettingsStore(s => s.keepScreenOn);

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

  const handleStartTimerPress = () => {
    stateMachine.run();
    setIsPaused(false);
  }

  const handlePauseTimerPress = () => {
    stateMachine.pause();
    setIsPaused(true);
  }

  const showTime = (timeInSec: number) => {
    if(timeInSec == 0){
      return '';
    }
    const minutes = Math.floor(timeInSec/60);
    const seconds = timeInSec > 60 ? timeInSec%60 : timeInSec;
    if(minutes > 0){
      return `${minutes}.${seconds.toString().padStart(2, '0')}`;
    }
    else {
      return `${seconds}`;
    }
  }

  const getAppStateText = () => {
    if(isPaused){
      return 'paused';
    }

    return appState === 'work' ? appState : 'play time'
  }

  return (
      <ErrorBoundary>
    <View style={[styles.container, {backgroundColor: background}]}>

      <TextWithShadow value="Catadoro" fontSize={35} padding={20} color="white" />
      <Timer width={300} height={300}/>
      <NavigationButton icon={'settings'} route={Routes.settings} />
      <View style={styles.row}>
        {(appState !== 'idle' && !isPaused) &&
          <IconButton size="large" type="pause" onPress={handlePauseTimerPress}/>
        }
        {(appState === 'idle' || isPaused) &&
          <IconButton size="large" type="play" onPress={handleStartTimerPress}/>
        }
        <IconButton size="small" type="plus" onPress={() => stateMachine.extend()} disabled={appState !== 'idle' || previousAppState === undefined}/>
      </View>
      <View style={styles.row}>
        {(appState !== 'idle' && countdownLeft !== 0) && <TextWithShadow value={getAppStateText()} padding={20} color="white"/>}
        <TextWithShadow value={showTime(countdownLeft)} fontSize={45} padding={20} color="white" />
      </View>
    </View>
      </ErrorBoundary>
  );

};

export default TimerScreen;
