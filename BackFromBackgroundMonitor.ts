import { AppState as ReactAppState, NativeEventSubscription } from "react-native";
import { AppState, useAppStateStore } from "./state/AppState";
import { useEffect, useRef } from "react";
import useLoggerService from "./services/logger/LoggerService";

type IAppStateMonitor = {
  start: (callback: () => void) => void;
  stop: () => void;
}

export const useBackFromBackgroundMonitor = (): IAppStateMonitor => {
  const subscription = useRef<NativeEventSubscription>(undefined);
  const countdownEndTime = useRef(0);
  const correctCountdown = useAppStateStore(s => s.correctCountdown);
  const log = useLoggerService('BM');

  useEffect(() => {
    const totalSub = useAppStateStore.subscribe((s) => s.countdownEndTime, (state) => countdownEndTime.current = state);

    return () => {
      totalSub();
    }
  }, []);

  const start = (timeEndCallback) => {
    subscription.current = ReactAppState.addEventListener('change', nextAppState => {
      if(ReactAppState.currentState === 'active'){
        const currentTime = Date.now();
        if(currentTime > countdownEndTime.current) {
          timeEndCallback();
        } else {
          const diff = Math.round((countdownEndTime.current - currentTime) / 1000);
          correctCountdown(diff);
          log.info('Countdown correction:', diff);
        }
      }
    });
  }

  const stop = () => {
    subscription.current?.remove();
  }

  return {
    start,
    stop
  }
}