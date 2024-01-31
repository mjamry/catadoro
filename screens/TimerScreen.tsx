
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Button, Platform, AppState } from 'react-native';
import IconButton from '../components/IconButton';
import { Routes } from '../Routes';
import { NavigationProps } from './RootScreenParams';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import useNotificationProvider, { NotificationDto } from '../Notifications';
import { useTimersStore } from '../state/AppTimers';
import { useAppStateStore } from '../state/AppState';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});



async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const TimerScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const notificationProvider = useNotificationProvider();
  const work = useTimersStore(s => s.work);
  const shortBreak = useTimersStore(s => s.shortBreak);
  const longBreak = useTimersStore(s => s.longBreak);
  const countdownLeft = useAppStateStore(s => s.countdown);
  const setDecreaseCountdown = useAppStateStore(s => s.decreaseCountdown);
  //const countdownEndTime = useAppStateStore(s => s.countdownEndTime);
  const _setCountdown = useAppStateStore(s => s.setCountdown);
  const setAppState = useAppStateStore(s => s.setAppState);
  
  const countdownEndTime = useRef(0);

  const setCountdown = (value: number) => {
    _setCountdown(value);
    countdownEndTime.current = Date.now() + value * 1000;
  }

  const countdownInterval = useRef<any>();
  useEffect(() => {
    //Notifications
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('notification!!!', new Date().toISOString());
      clearInterval(countdownInterval.current);
      setAppState('idle');
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Response:', response);
    });

    //AppState
    const subscription = AppState.addEventListener('change', nextAppState => {
        console.log('AppState', AppState.currentState, nextAppState, countdownInterval.current);
        if(AppState.currentState === 'active'){
          const currentTime = Date.now();
          console.log('time', currentTime, countdownEndTime, currentTime - countdownEndTime.current);
          if(currentTime > countdownEndTime.current) {
            console.log('END!!', countdownInterval.current);
            clearInterval(countdownInterval.current);
            setAppState('idle');
          } else {
            const diff = Math.round((countdownEndTime.current - currentTime) / 1000);
            setCountdown(diff);
            console.log('diff in S:', diff);
          }
        }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      subscription.remove();
    };
  }, []);

  const schedulePushNotification = async (notification: NotificationDto, time: number) => {
    await Notifications.scheduleNotificationAsync({
      content: notification,
      trigger: { seconds: time },
    });
  }

  const startTimer = () => {
    console.log('schedule notification');
    schedulePushNotification(
      notificationProvider.provide('workEnd'),
      work,
    );
    countdownInterval.current = setInterval(setDecreaseCountdown, 1000);
    setCountdown(work);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ff4081', paddingTop: Constants.statusBarHeight}}>
      <Text>Timer</Text>
      <View style={{margin: 20, position: 'absolute', top: Constants.statusBarHeight, right: 0}}>
        <IconButton size="medium" type="settings" onPress={() => navigation.navigate(Routes.settings)} />
      </View>
      <IconButton size="large" type="clock" onPress={startTimer} />
      <Text>Countdown: {countdownLeft} | StartTime: {countdownEndTime.current} | Now: {Date.now()}</Text>
    </View>
  );

};

export default TimerScreen;
