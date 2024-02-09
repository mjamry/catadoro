import { Canvas, useFont, Text } from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

type TextWithShadowProps = {
  value: string;
  color?: string;
  fontSize?: number;
  padding?: number;
}

const DefaultFontSize = 22;
const DefaultPadding = 8;
const ShadowPadding = 2;
const TextWithShadow = (props: TextWithShadowProps) => {
  const padding = props?.padding ?? DefaultPadding;
  const fontSize = props?.fontSize ?? DefaultFontSize;

  const font = useFont(require("./../assets/WickedMouse-aGoK.ttf"), fontSize);
  const titleMeasurement = font?.measureText(props.value ?? '');
  const titleWidth = titleMeasurement?.width ?? 0;
  const titleHeight = titleMeasurement?.height ?? 0;
  const canvasWidth = titleWidth + padding * 2;
  const canvasHeight = titleHeight + padding * 2 + ShadowPadding;

  const renderText = () => {
    return (
      <>
        <Text
          x={padding + ShadowPadding}
          y={padding + fontSize + ShadowPadding}
          text={props.value}
          font={font}
          color='black'
        />
        <Text
          x={padding}
          y={padding + fontSize}
          text={props.value}
          font={font}
          color={props.color ?? 'lightgray'}
        />
      </>
    )
  }

  return (
    <View>
      <Canvas style={{ width: canvasWidth, height: canvasHeight}}>
        {renderText()}
      </Canvas>
    </View>
  );

};

export default TextWithShadow;
