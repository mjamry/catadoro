import { useFonts } from 'expo-font';

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
  // Font files are required one by one so only the weights in use end up in the bundle.
  const [loaded, error] = useFonts({
    Nunito_500Medium: require('@expo-google-fonts/nunito/Nunito_500Medium.ttf'),
    Nunito_600SemiBold: require('@expo-google-fonts/nunito/Nunito_600SemiBold.ttf'),
    Nunito_700Bold: require('@expo-google-fonts/nunito/Nunito_700Bold.ttf'),
    Nunito_800ExtraBold: require('@expo-google-fonts/nunito/Nunito_800ExtraBold.ttf'),
    Fredoka_600SemiBold: require('@expo-google-fonts/fredoka/Fredoka_600SemiBold.ttf'),
    Fredoka_700Bold: require('@expo-google-fonts/fredoka/Fredoka_700Bold.ttf'),
  });
  // On a load error fall back to system fonts rather than blocking the app.
  return loaded || !!error;
};
