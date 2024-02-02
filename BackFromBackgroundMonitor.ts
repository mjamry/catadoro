import { AppState, NativeEventSubscription } from "react-native";
import { useAppStateStore } from "./state/AppState";
import { useEffect, useRef } from "react";

type IAppStateMonitor = {
  start: (callback: () => void) => void;
  stop: () => void;
}

export const useBackFromBackgroundMonitor = (): IAppStateMonitor => {
  const subscription = useRef<NativeEventSubscription>(undefined);
  const countdownEndTime = useRef(0);
  const countdownSubscription = useRef<any>();
  const setCountdown = useAppStateStore(s => s.setCountdown);

  useEffect(() => {
    countdownSubscription.current = useAppStateStore.subscribe(
      (s) => s.countdownEndTime,
      (current, previous) => {
        if(previous === 0 && current !== 0){
          countdownEndTime.current = current;
        }
      }
    );

    return () => {
      countdownSubscription.current();
      subscription.current?.remove();
    }
  }, []);

  const start = (timeEndCallback: () => void) => {
    subscription.current = AppState.addEventListener('change', nextAppState => {
      if(AppState.currentState === 'active'){
        const currentTime = Date.now();
        if(currentTime > countdownEndTime.current) {
          timeEndCallback();
        } else {
          const diff = Math.round((countdownEndTime.current - currentTime) / 1000);
          setCountdown(diff);
          console.log('[BFBM] diff in S:', diff);
        }
      }
    });
  }

  const stop = () => {
    subscription.current?.remove();
    countdownSubscription.current();
  }

  return {
    start,
    stop
  }
}