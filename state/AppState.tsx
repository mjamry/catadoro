import { create } from "zustand";

export type AppState = 'idle' | 'work' | 'shortBreak' | 'longBreak';

type AppStateStore = {
  state: AppState;
  countdown: number;
  countdownEndTime: number;
  setAppState: (state: AppState) => void;
  decreaseCountdown: () => void;
  setCountdown: (time: number) => void;
}

const msInS = 1000;

export const useAppStateStore = create<AppStateStore>((set) => ({
  state: 'idle',
  countdown: 0,
  countdownEndTime: 0,
  decreaseCountdown: () => set((state) => ({countdown: state.countdown - 1})),
  setCountdown: (value) => set({countdown: value, countdownEndTime: Date.now() + value * msInS}),
  setAppState: (value) => {
    console.log('SetAppState', value);
    switch(value){
      case 'idle':
        set({countdown: 0, countdownEndTime: 0})
      default:
        set({state: value})
    }
  },
}))