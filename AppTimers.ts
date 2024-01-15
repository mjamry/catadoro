import { create } from "zustand";

type TimersStore = {
  work: number;
  shortBreak: number;
  longBreak: number;
  setWork: (value: number) => void;
  setBreak: (value: number) => void;
  setLongBreak: (value: number) => void;
}

export const useTimersStore = create<TimersStore>((set) => ({
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  setWork: (value) => set({ work: value }),
  setBreak: (value) => set({ shortBreak: value }),
  setLongBreak: (value) => set({ longBreak: value }),
}))