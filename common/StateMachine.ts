import { useEffect, useRef, useState } from "react";
import { AppState, useAppStateStore } from "../state/AppState";
import { useTimersStore } from "../state/AppTimers";
import * as Notifications from 'expo-notifications';
import { useBackFromBackgroundMonitor } from "../BackFromBackgroundMonitor";
import useNotificationProvider, { NotificationDto } from "./Notifications";
import { useNotificationChannelIdStore } from "../state/AppNotifications";
import { useTimeInSeconds } from "./Hooks";
import useLoggerService from "../services/logger/LoggerService";

// START -> idle -> work -> (I) idle -> s break ->
// idle -> work -> (II) idle -> s break ->
// idle -> work -> (III) idle -> s break ->
// idle -> work -> (IV) idle -> L break -> END

const NumberOfWorkUnitsForLongBreak = 4;
const OneSecond = 1000;
const DefaultExtendTime = 5;

type IStateMachine = {
  run: () => void;
  pause: () => void;
  extend: () => void;
}

export const useStateMachine = (): IStateMachine => {
  const setCountdown = useAppStateStore(s => s.setCountdown);
  const updateCountdown = useAppStateStore(s => s.correctCountdown);
  const decreaseCountdown = useAppStateStore(s => s.decreaseCountdown);
  const setCurrent = useAppStateStore(s => s.setCurrentState);
  const setNext = useAppStateStore(s => s.setNextState);
  const next = useAppStateStore(s => s.nextState);
  const countdownLeft = useAppStateStore(s => s.countdown);
  const current = useAppStateStore(s => s.currentState);
  const previous = useAppStateStore(s => s.previousState);
  const notificationChannelId = useNotificationChannelIdStore(s => s.notificationChannelId);

  const workTime = useTimeInSeconds(useTimersStore(s => s.work));
  const shortBreakTime = useTimeInSeconds(useTimersStore(s => s.shortBreak));
  const longBreakTime = useTimeInSeconds(useTimersStore(s => s.longBreak));

  const responseListener = useRef<Notifications.Subscription>();
  const notificationListener = useRef<Notifications.Subscription>();
  const stateSub = useRef<any>();
  const countdownInterval = useRef<any>();
  const scheduledNotificationId = useRef('');
  const workUnitCount = useRef(1);

  const notificationProvider = useNotificationProvider();
  const backgroundStateMonitor = useBackFromBackgroundMonitor();

  const extendTimeInSeconds = useTimeInSeconds(DefaultExtendTime);
  const log = useLoggerService('SM');

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
    cleanUp();
    setCountdown(0);
    setCurrent('idle');
  }

  useEffect(() => {
    //notification received
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      log.info(`Timer end: ${notification.request.content.title}`, new Date(notification.date).toISOString(), notification.request.identifier);
      handleTimeEnd();
    });

    //TODO think if this is somehow useful
    //notification response
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      log.info('Notification response',response.notification.date, response.notification.request.identifier, response.notification);
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
      backgroundStateMonitor.stop();
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
      if(current === 'idle' || current === undefined) {
        state = next;
        setCurrent(state);
      }

      let timeInSeconds = 0;
      if(countdownLeft === 0){
        timeInSeconds = getCountdown(state)
        setCountdown(timeInSeconds);
      } else {
        timeInSeconds = countdownLeft;
        updateCountdown(timeInSeconds);
      }

      if(state !== 'idle'){
        await scheduleNotification(timeInSeconds, state);
        backgroundStateMonitor.start(handleTimeEnd);
      }

      log.info(`Run: ${state}`, timeInSeconds, scheduledNotificationId.current);
    }
  }

  const extend = async () => {
    if(countdownInterval.current === undefined){
      if(current === 'idle'){
        setCurrent(previous);
        setCountdown(extendTimeInSeconds);
        await scheduleNotification(extendTimeInSeconds, previous);
        backgroundStateMonitor.start(handleTimeEnd);
        log.info(`Extend: ${previous}`, extendTimeInSeconds, scheduledNotificationId.current);
      }
    }
  }

  const pause = () => {
    cleanUp();
    log.info(`Pause: ${current}`, countdownLeft);
    Notifications.cancelScheduledNotificationAsync(scheduledNotificationId.current);
  }

  const cleanUp = () => {
    clearInterval(countdownInterval.current);
    countdownInterval.current = undefined;
    backgroundStateMonitor.stop();
  }

  return {
    run,
    pause,
    extend,
  }
}