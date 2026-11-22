import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/useTheme';

type Variant = 'title' | 'heading' | 'body' | 'bodyStrong' | 'caption' | 'label';
type Tone = 'default' | 'muted' | 'accent' | 'onAccent';

type AppTextProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle['textAlign'];
};

const variants: Record<Variant, TextStyle> = {
  title: { fontFamily: fonts.displayBold, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: fonts.bodyExtraBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.bodyExtraBold, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 19 },
  label: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 17 },
};

// Text with the app fonts and theme colours. Nested <AppText> inherits the parent style.
const AppText = ({ variant = 'body', tone = 'default', align, style, ...rest }: AppTextProps) => {
  const { colors } = useTheme();
  const color = {
    default: colors.text,
    muted: colors.textMuted,
    accent: colors.accent,
    onAccent: colors.onAccent,
  }[tone];

  return <Text {...rest} style={[variants[variant], { color, textAlign: align }, style]} />;
};

export default AppText;
