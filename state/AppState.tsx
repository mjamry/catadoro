import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'
import * as SecureStore from 'expo-secure-store';
import { CycleState, dayKey } from "../common/cycle";
import { cycleStateKey } from "./SettingsConsts";

export type AppState = 'idle' | 'work' | 'shortBreak' | 'longBreak';

type AppStateStore = {
  currentState: AppState;
  nextState: AppState;
  previousState: AppState;
  countdown: number;
  totalCountdown: number;
  countdownEndTime: number;
  // Session cycle (#76)
  completedFocus: number;
  cycleDate: string;
  isPaused: boolean;
  setCurrentState: (state: AppState) => void;
  setNextState: (state: AppState) => void;
  decreaseCountdown: () => void;
  setCountdown: (time: number) => void;
  correctCountdown: (time: number) => void;
  setCycle: (cycle: Pick<CycleState, 'completedFocus' | 'cycleDate'>) => void;
  setPaused: (value: boolean) => void;
}

const msInS = 1000;

type PersistedCycle = {
  completedFocus: number;
  cycleDate: string;
  nextState: AppState;
};

const persistCycle = (state: PersistedCycle) => {
  SecureStore.setItemAsync(cycleStateKey, JSON.stringify(state));
}

const stateReducer = (state, value) => {
  switch(value){
    case 'idle':
      return {countdown: 0, countdownEndTime: 0, currentState: value, previousState: state.currentState, isPaused: false}
    default:
      return {currentState: value, previousState: state.currentState}
  }
}

export const useAppStateStore = create<AppStateStore>()
  (subscribeWithSelector((set, get) => ({
    currentState: undefined,
    nextState: 'work',
    previousState: undefined,
    countdown: 0,
    totalCountdown: 0,
    countdownEndTime: 0,
    completedFocus: 0,
    cycleDate: dayKey(new Date()),
    isPaused: false,
    decreaseCountdown: () => set((state) => ({
      //do not allow to decrease below 0
      //this might occur because of rounding seconds when getting back from the background
      countdown: state.countdown > 0 ? state.countdown - 1 : 0
    })),
    setCountdown: (value) => {
      //split into two parts to have totalCountdown updated earlier - small hack
      set({totalCountdown: value});
      set({
        countdown: value,
        countdownEndTime: Date.now() + value * msInS});
    },
    // Keeps the end time in sync too, so "ends HH:MM" and background checks stay right after a resume.
    correctCountdown: (value) => set({countdown: value, countdownEndTime: Date.now() + value * msInS}),
    setCurrentState: (value) => set((state) => stateReducer(state, value)),
    setNextState: (value) => {
      set({nextState: value});
      const { completedFocus, cycleDate } = get();
      persistCycle({ completedFocus, cycleDate, nextState: value });
    },
    setCycle: ({ completedFocus, cycleDate }) => {
      set({ completedFocus, cycleDate });
      persistCycle({ completedFocus, cycleDate, nextState: get().nextState });
    },
    setPaused: (value) => set({ isPaused: value }),
  })))

// Restore the cycle position after an app restart.
SecureStore.getItemAsync(cycleStateKey).then((value) => {
  if (!value) {
    return;
  }
  try {
    const saved = JSON.parse(value) as PersistedCycle;
    const today = dayKey(new Date());
    // A new day starts a fresh cycle at session 1.
    if (saved.cycleDate !== today) {
      return;
    }
    useAppStateStore.setState({
      completedFocus: saved.completedFocus ?? 0,
      cycleDate: today,
      nextState: saved.nextState ?? 'work',
    });
  } catch {
    // Corrupted value: start a fresh cycle.
  }
});
