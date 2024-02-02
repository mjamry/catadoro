
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Button, Platform, AppState } from 'react-native';
import IconButton from '../components/IconButton';
import { Routes } from '../Routes';
import { NavigationProps } from './RootScreenParams';

import { useAppStateStore } from '../state/AppState';
import { useStateMachine } from '../StateMachine';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

const TimerScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const countdownLeft = useAppStateStore(s => s.countdown);
  const appState = useAppStateStore(s => s.currentState);
  const nextAppState = useAppStateStore(s => s.nextState);
  const stateMachine = useStateMachine();

  const handleStartTimerPress = () => {
    stateMachine.next();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ff4081', paddingTop: Constants.statusBarHeight}}>
      <Text>Timer</Text>
      <View style={{margin: 20, position: 'absolute', top: Constants.statusBarHeight, right: 0}}>
        <IconButton size="medium" type="settings" onPress={() => navigation.navigate(Routes.settings)} />
      </View>
      <IconButton size="large" type="clock" onPress={handleStartTimerPress} disabled={appState !== 'idle'}/>
      <Text style={{fontSize: 20}}>
        Countdown: {countdownLeft}
      </Text>
      <Text style={{fontSize: 20}}>
        state: {appState}
      </Text>
      <Text style={{fontSize: 20}}>
        next state: {nextAppState}
      </Text>
    </View>
  );

};

export default TimerScreen;
