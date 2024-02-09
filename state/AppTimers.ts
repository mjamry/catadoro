import { create } from "zustand";

type TimersStore = {
  work: number;
  shortBreak: number;
  longBreak: number;
  setWork: (value: number) => void;
  setShortBreak: (value: number) => void;
  setLongBreak: (value: number) => void;
}

const SecondsInMinute = 1;

export const useTimersStore = create<TimersStore>((set) => ({
  work: 10 * SecondsInMinute,
  shortBreak: 5 * SecondsInMinute,
  longBreak: 15 * SecondsInMinute,
  setWork: (value) => set({ work: value * SecondsInMinute}),
  setShortBreak: (value) => set({ shortBreak: value * SecondsInMinute}),
  setLongBreak: (value) => set({ longBreak: value * SecondsInMinute}),
}))