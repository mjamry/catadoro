import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'

export type AppState = 'idle' | 'work' | 'shortBreak' | 'longBreak';

type AppStateStore = {
  currentState: AppState;
  nextState: AppState;
  previousState: AppState;
  countdown: number;
  countdownEndTime: number;
  setCurrentState: (state: AppState) => void;
  setNextState: (state: AppState) => void;
  decreaseCountdown: () => void;
  setCountdown: (time: number) => void;
}

const msInS = 1000;

const stateReducer = (state, value) => {
  switch(value){
    case 'idle':
      return {countdown: 0, countdownEndTime: 0, currentState: value, previousState: state.currentState}
    default:
      return {currentState: value, previousState: state.currentState}
  }
}

export const useAppStateStore = create<AppStateStore>()
  (subscribeWithSelector((set) => ({
    currentState: 'idle',
    nextState: 'work',
    previousState: 'idle',
    countdown: 0,
    countdownEndTime: 0,
    decreaseCountdown: () => set((state) => ({
      //do not allow to decrease below 0
      //this might occur because of rounding seconds when getting back from the background
      countdown: state.countdown > 0 ? state.countdown - 1 : 0
    })),
    setCountdown: (value) => set({countdown: value, countdownEndTime: Date.now() + value * msInS}),
    setCurrentState: (value) => set((state) => stateReducer(state, value)),
    setNextState: (value) => set({nextState: value}),
  })))
