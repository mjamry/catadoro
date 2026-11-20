import { useFonts } from 'expo-font';
import {
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';

// Font family names as registered by useAppFonts().
export const fonts = {
  body: 'Nunito_500Medium',
  bodySemiBold: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
  bodyExtraBold: 'Nunito_800ExtraBold',
  display: 'Fredoka_600SemiBold',
  displayBold: 'Fredoka_700Bold',
} as const;

// Loads all app fonts; returns true once they can be used.
export const useAppFonts = (): boolean => {
  const [loaded, error] = useFonts({
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });
  // On a load error fall back to system fonts rather than blocking the app.
  return loaded || !!error;
};
