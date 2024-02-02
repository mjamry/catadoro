import { useEffect, useRef, useState } from "react";
import { AppState, useAppStateStore } from "./state/AppState";
import { useTimersStore } from "./state/AppTimers";
import * as Notifications from 'expo-notifications';
import { useBackFromBackgroundMonitor } from "./BackFromBackgroundMonitor";
import useNotificationProvider, { NotificationDto } from "./Notifications";

// START -> idle -> work -> (I) idle -> s break ->
// idle -> work -> (II) idle -> s break ->
// idle -> work -> (III) idle -> s break ->
// idle -> work -> (IV) idle -> L break -> END

const NumberOfWorkUnitsForLongBreak = 4;
const OneSecond = 1000;

type IStateMachine = {
  next: () => void;
}

export const useStateMachine = (): IStateMachine => {
  const [, setNotification] = useState<Notifications.Notification>();
  const [workUnitCount, setWorkUnitCount] = useState(1);

  const setCountdown = useAppStateStore(s => s.setCountdown);
  const decreaseCountdown = useAppStateStore(s => s.decreaseCountdown);
  const setAppState = useAppStateStore(s => s.setCurrentState);
  const setNextState = useAppStateStore(s => s.setNextState);
  const nextState = useAppStateStore(s => s.nextState);

  const workTime = useTimersStore(s => s.work);
  const shortBreakTime = useTimersStore(s => s.shortBreak);
  const longBreakTime = useTimersStore(s => s.longBreak);

  const responseListener = useRef<Notifications.Subscription>();
  const notificationListener = useRef<Notifications.Subscription>();
  const stateSub = useRef<any>();
  const countdownInterval = useRef<any>();

  const notificationProvider = useNotificationProvider();
  const stateMonitor = useBackFromBackgroundMonitor();

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

  const handleStateChange = (previous: AppState, current: AppState) => {
    if(current === 'idle'){
      if(previous === 'work'){
        if(workUnitCount === NumberOfWorkUnitsForLongBreak){
          setNextState('longBreak');
          setWorkUnitCount(1);
        } else {
          setNextState('shortBreak');
          setWorkUnitCount(workUnitCount + 1);
        }
      } else {
        setNextState('work');
      }
    } else {
      console.log('set next state to idle');
      setNextState('idle');
    }
  }

  const handleTimeEnd = () => {
    clearInterval(countdownInterval.current);
    countdownInterval.current = undefined;
    console.log('timer end');
    setAppState('idle');
  }

  useEffect(() => {
    // global app state
    stateMonitor.start(handleTimeEnd);

    //notification received
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('notification fired');
      handleTimeEnd();
    });

    //TODO think if this is somehow useful
    //notification response
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
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
  })

  const schedulePushNotification = async (notification: NotificationDto, time: number) => {
    await Notifications.scheduleNotificationAsync({
      content: notification,
      trigger: { seconds: time },
    });
  }

  const next = () => {
    setAppState(nextState);
    const countdown = getCountdown(nextState);
    setCountdown(countdown);

    if(nextState !== 'idle'){
      countdownInterval.current = setInterval(decreaseCountdown, OneSecond);
      schedulePushNotification(
        notificationProvider.provide(nextState),
        countdown,
      );
    }
    console.log('run next state', nextState, countdown);
  }

  return {
    next,
  }
}