import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';

type TimersStore = {
  work: number;
  shortBreak: number;
  longBreak: number;
  setWork: (value: number) => void;
  setShortBreak: (value: number) => void;
  setLongBreak: (value: number) => void;
}

const workKey = 'catadoro_app_timer_work';
const shortBreakKey = 'catadoro_app_timer_short_break';
const longBreakKey = 'catadoro_app_timer_long_break';
const defaultWorkTime = 10;
const defaultShortBreakTime = 5;
const defaultLongBreakTime = 15;

export const useTimersStore = create<TimersStore>((set) => ({
  work: defaultWorkTime,
  shortBreak: defaultShortBreakTime,
  longBreak: defaultLongBreakTime,
  setWork: (value) => {
    set({ work: value});
    SecureStore.setItemAsync(workKey, (value).toString());
  },
  setShortBreak: (value) => {
    set({ shortBreak: value});
    SecureStore.setItemAsync(shortBreakKey, (value).toString());
  },
  setLongBreak: (value) => {
    set({ longBreak: value});
    SecureStore.setItemAsync(longBreakKey, (value).toString());
  },
}))

SecureStore.getItemAsync(workKey).then((value) =>
  useTimersStore.setState({ work: value ? parseInt(value) : defaultWorkTime })
);

SecureStore.getItemAsync(shortBreakKey).then((value) =>
  useTimersStore.setState({ shortBreak: value ? parseInt(value) : defaultShortBreakTime })
);

SecureStore.getItemAsync(longBreakKey).then((value) =>
  useTimersStore.setState({ longBreak: value ? parseInt(value) : defaultLongBreakTime })
);
