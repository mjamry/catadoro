import { useFont, vec, Text } from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import TextWithShadow from './TextWithShadow';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

type TextWithShadowProps = {
  value: string;
  color?: string;
  fontSize?: number;
  padding?: number;
}

const DefaultFontSize = 22;
const DefaultPadding = 8;
const ShadowPadding = 2;
const MultilineTextWithShadow = (props: TextWithShadowProps) => {
  const padding = props?.padding ?? DefaultPadding;
  const fontSize = props?.fontSize ?? DefaultFontSize;

  const font = useFont(require("./../assets/WickedMouse-aGoK.ttf"), fontSize);

  const lines = props.value.split('\n')
  console.log(lines);
  return (
    <View style={styles.container}>
      {lines && lines.map((line, index) => (
        <TextWithShadow value={line} fontSize={fontSize}/>
      ))}
    </View>
  );
};

export default MultilineTextWithShadow;
