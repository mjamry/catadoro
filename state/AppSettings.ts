import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';
import { defaultSessionsPerCycle, keepScreenOnKey, sessionsPerCycleKey } from "./SettingsConsts";

type AppSettingsStore = {
  keepScreenOn: boolean;
  // Focus sessions before the long break (editable in settings with #81).
  sessionsPerCycle: number;
  setKeepScreenOn: (value: boolean) => void;
  setSessionsPerCycle: (value: number) => void;
}

export const useAppSettingsStore = create<AppSettingsStore>((set) => ({
  keepScreenOn: false,
  sessionsPerCycle: defaultSessionsPerCycle,
  setKeepScreenOn: (value: boolean) => {
    set({ keepScreenOn: value});
    SecureStore.setItemAsync(keepScreenOnKey, value.toString());
  },
  setSessionsPerCycle: (value: number) => {
    set({ sessionsPerCycle: value });
    SecureStore.setItemAsync(sessionsPerCycleKey, value.toString());
  },
}))

SecureStore.getItemAsync(keepScreenOnKey).then((value) =>
  useAppSettingsStore.setState({ keepScreenOn: value && value === 'true' ? true : false })
);

SecureStore.getItemAsync(sessionsPerCycleKey).then((value) => {
  const parsed = value ? parseInt(value) : NaN;
  useAppSettingsStore.setState({ sessionsPerCycle: parsed >= 2 && parsed <= 8 ? parsed : defaultSessionsPerCycle });
});
