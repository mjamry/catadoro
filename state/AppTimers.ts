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

const SecondsInMinute = 1;
const workKey = 'app_timer_work';
const shortBreakKey = 'app_timer_short_break';
const longBreakKey = 'app_timer_long_break';
const defaultWorkTime = 10 * SecondsInMinute;
const defaultShortBreakTime = 5 * SecondsInMinute;
const defaultLongBreakTime = 15 * SecondsInMinute;

export const useTimersStore = create<TimersStore>((set) => ({
  work: defaultWorkTime,
  shortBreak: defaultShortBreakTime,
  longBreak: defaultLongBreakTime,
  setWork: (value) => {
    const valueInSeconds = value * SecondsInMinute;
    set({ work: valueInSeconds});
    SecureStore.setItemAsync(workKey, (valueInSeconds).toString());
  },
  setShortBreak: (value) => {
    const valueInSeconds = value * SecondsInMinute;
    set({ shortBreak: valueInSeconds});
    SecureStore.setItemAsync(shortBreakKey, (valueInSeconds).toString());
  },
  setLongBreak: (value) => {
    const valueInSeconds = value * SecondsInMinute;
    set({ longBreak: valueInSeconds});
    SecureStore.setItemAsync(longBreakKey, (valueInSeconds).toString());
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
