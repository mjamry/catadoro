import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';
import { backgroundColorKey, defaultBackground } from "./SettingsConsts";

type ColorsStore = {
  background: string;
  setBackground: (value: string) => void;
}

export const useColorsStore = create<ColorsStore>((set) => ({
  background: defaultBackground,
  setBackground: (value) => {
    set({ background: value});
    SecureStore.setItemAsync(backgroundColorKey, value);
  },
}))

SecureStore.getItemAsync(backgroundColorKey).then((value) =>
  useColorsStore.setState({ background: value ? value : defaultBackground })
);
