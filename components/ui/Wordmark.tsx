import React from 'react';
import { Text } from 'react-native';
import { fonts } from '../../theme/fonts';
import { palette } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

type WordmarkProps = {
  size?: number;
};

// "catadoro" logo: rounded display font with the tomato-red "a".
const Wordmark = ({ size = 26 }: WordmarkProps) => {
  const { colors } = useTheme();

  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="Catadoro"
      style={{ fontFamily: fonts.displayBold, fontSize: size, color: colors.text, letterSpacing: 0.2 }}
    >
      cat<Text style={{ color: palette.tomato }}>a</Text>doro
    </Text>
  );
};

export default Wordmark;
