import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'

export type AppState = 'idle' | 'work' | 'shortBreak' | 'longBreak';

type AppStateStore = {
  currentState: AppState;
  nextState: AppState;
  countdown: number;
  countdownEndTime: number;
  setCurrentState: (state: AppState) => void;
  setNextState: (state: AppState) => void;
  decreaseCountdown: () => void;
  setCountdown: (time: number) => void;
}

const msInS = 1000;

export const useAppStateStore = create<AppStateStore>()
  (subscribeWithSelector((set) => ({
    currentState: 'idle',
    nextState: 'work',
    countdown: 0,
    countdownEndTime: 0,
    decreaseCountdown: () => set((state) => ({
      //do not allow to decrease below 0
      //this might occur because of rounding seconds when getting back from the background
      countdown: state.countdown > 0 ? state.countdown - 1 : 0
    })),
    setCountdown: (value) => set({countdown: value, countdownEndTime: Date.now() + value * msInS}),
    setCurrentState: (value) => {
      switch(value){
        case 'idle':
          set({countdown: 0, countdownEndTime: 0})
        default:
          set({currentState: value})
      }
    },
    setNextState: (value) => set({nextState: value}),
  })))
