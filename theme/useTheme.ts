import { useAppStateStore } from '../state/AppState';
import { ThemeColors, breakColors, buttonSize, elevation, lightColors, radius, spacing, tileTones } from './tokens';

export type Theme = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  buttonSize: typeof buttonSize;
  elevation: typeof elevation;
  tileTones: typeof tileTones;
  isBreak: boolean;
};

export const isBreakState = (state: string | undefined) =>
  state === 'shortBreak' || state === 'longBreak';

// Returns the theme for the current phase: cream for focus/idle, mint accents during breaks.
export const useTheme = (): Theme => {
  const currentState = useAppStateStore(s => s.currentState);
  const isBreak = isBreakState(currentState);

  return {
    colors: isBreak ? breakColors : lightColors,
    spacing,
    radius,
    buttonSize,
    elevation,
    tileTones,
    isBreak,
  };
};
