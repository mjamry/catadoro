
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Button, Platform, AppState } from 'react-native';
import IconButton from '../components/IconButton';
import { Routes } from '../Routes';
import { NavigationProps } from './RootScreenParams';

import { useAppStateStore } from '../state/AppState';
import { useStateMachine } from '../StateMachine';
import Timer from '../components/Timer';
import TextWithShadow from '../components/TextWithShadow';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'lightpink',
    paddingTop: Constants.statusBarHeight + 50
  },
  settingsButton: {
    margin: 10,
    position: 'absolute',
    top: Constants.statusBarHeight,
    right: 0
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  }
});

const TimerScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const countdownLeft = useAppStateStore(s => s.countdown);
  const appState = useAppStateStore(s => s.currentState);
  const nextAppState = useAppStateStore(s => s.nextState);
  const stateMachine = useStateMachine();

  const [isPaused, setIsPaused] = useState(false);

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
    <View style={styles.container}>
      <TextWithShadow value="Catadoro" fontSize={35} padding={20} color="white" />
      <Timer width={300} height={300}/>
      <View style={styles.settingsButton}>
        <IconButton size="medium" type="settings" onPress={() => navigation.navigate(Routes.settings)} />
      </View>
      <View style={styles.row}>
        {(appState !== 'idle' && !isPaused) &&
          <IconButton size="large" type="pause" onPress={handlePauseTimerPress}/>
        }
        {(appState === 'idle' || isPaused) &&
          <IconButton size="large" type="play" onPress={handleStartTimerPress}/>
        }
        <IconButton size="small" type="plus" onPress={() => stateMachine.extend(5)} disabled={appState !== 'idle'}/>
      </View>
      <View style={styles.row}>
        {(appState !== 'idle' && countdownLeft !== 0) && <TextWithShadow value={getAppStateText()} padding={20} color="white"/>}
        <TextWithShadow value={showTime(countdownLeft)} fontSize={45} padding={20} color="white" />
      </View>
    </View>
  );

};

export default TimerScreen;
