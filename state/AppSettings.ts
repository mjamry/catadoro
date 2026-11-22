import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';
import { catNameKey, defaultSessionsPerCycle, keepScreenOnKey, sessionsPerCycleKey } from "./SettingsConsts";
import { CatNameMaxLength, cleanCatName } from "../common/mood";

type AppSettingsStore = {
  keepScreenOn: boolean;
  // Focus sessions before the long break (editable in settings with #81).
  sessionsPerCycle: number;
  // Optional name the cat signs its lines with (#98). Empty = no name.
  catName: string;
  setKeepScreenOn: (value: boolean) => void;
  setSessionsPerCycle: (value: number) => void;
  setCatName: (value: string) => void;
}

export const useAppSettingsStore = create<AppSettingsStore>((set) => ({
  keepScreenOn: false,
  sessionsPerCycle: defaultSessionsPerCycle,
  catName: '',
  setKeepScreenOn: (value: boolean) => {
    set({ keepScreenOn: value});
    SecureStore.setItemAsync(keepScreenOnKey, value.toString());
  },
  setSessionsPerCycle: (value: number) => {
    set({ sessionsPerCycle: value });
    SecureStore.setItemAsync(sessionsPerCycleKey, value.toString());
  },
  setCatName: (value: string) => {
    // Kept as typed while editing; trimmed when used and when restored.
    const name = value.slice(0, CatNameMaxLength);
    set({ catName: name });
    SecureStore.setItemAsync(catNameKey, name);
  },
}))

SecureStore.getItemAsync(keepScreenOnKey).then((value) =>
  useAppSettingsStore.setState({ keepScreenOn: value && value === 'true' ? true : false })
);

SecureStore.getItemAsync(sessionsPerCycleKey).then((value) => {
  const parsed = value ? parseInt(value) : NaN;
  useAppSettingsStore.setState({ sessionsPerCycle: parsed >= 2 && parsed <= 8 ? parsed : defaultSessionsPerCycle });
});

SecureStore.getItemAsync(catNameKey).then((value) =>
  useAppSettingsStore.setState({ catName: cleanCatName(value) })
);
