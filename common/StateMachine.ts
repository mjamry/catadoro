import { useEffect, useRef, useState } from "react";
import { AppState, useAppStateStore } from "../state/AppState";
import { useTimersStore } from "../state/AppTimers";
import * as Notifications from 'expo-notifications';
import { useBackFromBackgroundMonitor } from "../BackFromBackgroundMonitor";
import useNotificationProvider, { NotificationDto } from "./Notifications";
import { useNotificationChannelIdStore } from "../state/AppNotifications";

// START -> idle -> work -> (I) idle -> s break ->
// idle -> work -> (II) idle -> s break ->
// idle -> work -> (III) idle -> s break ->
// idle -> work -> (IV) idle -> L break -> END

const NumberOfWorkUnitsForLongBreak = 4;
const OneSecond = 1000;

type IStateMachine = {
  run: () => void;
  pause: () => void;
  extend: (time: number) => void;
}

const SecondsInMinute = 60;

const getTimeInSeconds = (time: number) => {
  return time*SecondsInMinute;
};
export const useStateMachine = (): IStateMachine => {
  const setCountdown = useAppStateStore(s => s.setCountdown);
  const decreaseCountdown = useAppStateStore(s => s.decreaseCountdown);
  const setCurrent = useAppStateStore(s => s.setCurrentState);
  const setNext = useAppStateStore(s => s.setNextState);
  const next = useAppStateStore(s => s.nextState);
  const countdownLeft = useAppStateStore(s => s.countdown);
  const current = useAppStateStore(s => s.currentState);
  const previous = useAppStateStore(s => s.previousState);
  const notificationChannelId = useNotificationChannelIdStore(s => s.notificationChannelId);

  const workTime = getTimeInSeconds(useTimersStore(s => s.work));
  const shortBreakTime = getTimeInSeconds(useTimersStore(s => s.shortBreak));
  const longBreakTime = getTimeInSeconds(useTimersStore(s => s.longBreak));

  const responseListener = useRef<Notifications.Subscription>();
  const notificationListener = useRef<Notifications.Subscription>();
  const stateSub = useRef<any>();
  const countdownInterval = useRef<any>();
  const scheduledNotificationId = useRef('');
  const workUnitCount = useRef(1);

  const notificationProvider = useNotificationProvider();
  const stateMonitor = useBackFromBackgroundMonitor();
  const buildType = useEnvironmentStore(s => s.buildType);

  const getCountdown = (state: AppState) => {
    switch (state){
      case 'work':
        return workTime;
      case 'shortBreak':
        return shortBreakTime;
      case 'longBreak':
        return longBreakTime;
      case 'idle':
      default:
        return 0;
    }
  }

  const handleStateChange = (current: AppState, previous: AppState) => {
    if(current === 'idle'){
      if(previous === 'work'){
        if(workUnitCount.current === NumberOfWorkUnitsForLongBreak){
          setNext('longBreak');
          workUnitCount.current = 1;
        } else {
          setNext('shortBreak');
          workUnitCount.current++;
        }
      } else {
        setNext('work');
      }
    }
  }

  const handleTimeEnd = () => {
    clearInterval(countdownInterval.current);
    countdownInterval.current = undefined;
    setCurrent('idle');
  }

  useEffect(() => {
    // global app state
    stateMonitor.start(handleTimeEnd);

    //notification received
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('timer end: ',notification.request.content.title,notification.date, notification.request.identifier);
      handleTimeEnd();
    });

    //TODO think if this is somehow useful
    //notification response
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('notification handled: ',response.notification.date, response.notification.request.identifier, response.notification);
    });

    // internal app state
    stateSub.current = useAppStateStore.subscribe(
      (s) => s.currentState,
      handleStateChange
    );

    return () => {
      stateSub.current();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      stateMonitor.stop();
    }
  }, [])

  const scheduleNotification = async (time: number, state: AppState) => {
    Notifications.dismissAllNotificationsAsync();
    countdownInterval.current = setInterval(decreaseCountdown, OneSecond);
    scheduledNotificationId.current = await Notifications.scheduleNotificationAsync({
      content: notificationProvider.provide(state),
      trigger: {
        channelId: notificationChannelId,
        seconds: time
      },
    });
  }

  const run = async () => {
    let state = current;
    if(countdownInterval.current === undefined){
      if(current === 'idle'){
        setCurrent(next);
        state = next;
      }

      const timeInSeconds = countdownLeft === 0 ? getCountdown(next) : countdownLeft;
      setCountdown(timeInSeconds);

      if(next !== 'idle'){
        await scheduleNotification(timeInSeconds, state);
      }

      console.log('run: ',state, timeInSeconds, scheduledNotificationId.current);
    }
  }

  const extend = async (time: number) => {
    const timeInSeconds = getTimeInSeconds(time);
    if(countdownInterval.current === undefined){
      if(current === 'idle'){
        setCurrent(previous);
      }
      setCountdown(timeInSeconds);
      await scheduleNotification(timeInSeconds, previous);

      console.log('extend: ',previous, timeInSeconds, scheduledNotificationId.current);
    }
  }

  const pause = () => {
    clearInterval(countdownInterval.current);
    countdownInterval.current = undefined;
    Notifications.cancelScheduledNotificationAsync(scheduledNotificationId.current);
  }

  return {
    run,
    pause,
    extend,
  }
}