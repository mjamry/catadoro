import { AppState as ReactAppState, NativeEventSubscription } from "react-native";
import { AppState, useAppStateStore } from "./state/AppState";
import { useEffect, useRef } from "react";

type IAppStateMonitor = {
  start: () => void;
  stop: () => void;
}

export const useBackFromBackgroundMonitor = (): IAppStateMonitor => {
  const subscription = useRef<NativeEventSubscription>(undefined);
  const countdownEndTime = useRef(0);
  const correctCountdown = useAppStateStore(s => s.correctCountdown);

  useEffect(() => {
    const totalSub = useAppStateStore.subscribe((s) => s.countdownEndTime, (state) => countdownEndTime.current = state);

    return () => {
      totalSub();
    }
  }, []);

  const start = () => {
    subscription.current = ReactAppState.addEventListener('change', nextAppState => {
      if(ReactAppState.currentState === 'active'){
        const currentTime = Date.now();
        const diff = Math.round((countdownEndTime.current - currentTime) / 1000);
        correctCountdown(diff);
        console.log('[BFBM] Countdown correction:', diff);
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