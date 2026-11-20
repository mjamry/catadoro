import React from 'react';
import { Text, View } from 'react-native';
import { fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/useTheme';

type TimeDisplayProps = {
  seconds: number;
  size?: number;
};

export const formatTime = (totalSeconds: number) => {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// MM:SS where every digit sits in a fixed-width cell, so the time never shifts sideways
// while counting down (fonts with proportional digits would make it jump).
const TimeDisplay = ({ seconds, size = 76 }: TimeDisplayProps) => {
  const { colors } = useTheme();
  const text = formatTime(seconds);
  const digitWidth = size * 0.62;
  const colonWidth = size * 0.3;

  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center' }}
      accessible
      accessibilityRole="timer"
      accessibilityLabel={`${Math.floor(seconds / 60)} minutes ${Math.round(seconds % 60)} seconds`}
    >
      {text.split('').map((char, index) => (
        <Text
          key={index}
          style={{
            width: char === ':' ? colonWidth : digitWidth,
            textAlign: 'center',
            fontFamily: fonts.displayBold,
            fontSize: size,
            lineHeight: size * 1.15,
            color: colors.text,
            includeFontPadding: false,
          }}
        >
          {char}
        </Text>
      ))}
    </View>
  );
};

export default TimeDisplay;
