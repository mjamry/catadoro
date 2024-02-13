import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';

type ColorsStore = {
  background: string;
  setBackground: (value: string) => void;
}

const SecondsInMinute = 1;
const backgroundColorKey = 'catadoro_app_colors_background';
const defaultWorkTime = '#606c38';

export const useColorsStore = create<ColorsStore>((set) => ({
  background: defaultWorkTime,
  setBackground: (value) => {
    set({ background: value});
    SecureStore.setItemAsync(backgroundColorKey, value);
  },
}))

SecureStore.getItemAsync(backgroundColorKey).then((value) =>
  useColorsStore.setState({ background: value ? value : defaultWorkTime })
);
