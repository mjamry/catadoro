import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';
import { keepScreenOnKey } from "./SettingsConsts";

type AppSettingsStore = {
  keepScreenOn: boolean;
  setKeepScreenOn: (value: boolean) => void;
}

export const useAppSettingsStore = create<AppSettingsStore>((set) => ({
  keepScreenOn: false,
  setKeepScreenOn: (value: boolean) => {
    set({ keepScreenOn: value});
    SecureStore.setItemAsync(keepScreenOnKey, value.toString());
  },
}))

SecureStore.getItemAsync(keepScreenOnKey).then((value) =>
  useAppSettingsStore.setState({ keepScreenOn: value && value === 'true' ? true : false })
);