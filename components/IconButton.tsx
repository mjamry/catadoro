import { Canvas, Fill, Circle, FitBox, rect, ImageSVG } from '@shopify/react-native-skia';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import useSvgProvider, { SvgType } from '../SvgProvider';

type Size = 'small' | 'medium' | 'large';
type SvgProps = {
  shadowPadding: number;
  size: number;
  iconXPadding: number;
  iconYPadding: number;
}

type IconProps = {
  size: Size;
  type: SvgType;
  onPress: () => void;
}

const getDimensions = (size: Size): SvgProps => {
  switch (size) {
    case 'large':
      return {
        shadowPadding: 6,
        size: 80,
        iconXPadding: 16,
        iconYPadding: 20
      };
    case 'medium':
      return {
        shadowPadding: 4,
        size: 60,
        iconXPadding: 12,
        iconYPadding: 16
      };
    case 'small':
    default:
      return {
        shadowPadding: 2,
        size: 40,
        iconXPadding: 8,
        iconYPadding: 10
      };
  }
}

const Padding = 5;
const ShadowPadding = 5;

const IconButton = (props: IconProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [startPoint, setStartPoint] = useState(0);
  const svgProps = getDimensions(props.size);
  const iconProvider = useSvgProvider();
  const icon = iconProvider.getSvg('cat_head', 'white');
  const iconShadow = iconProvider.getSvg('cat_head', 'black');
  const ic = iconProvider.getSvg(props.type);

  const tap = Gesture.Tap()
  .onTouchesDown(() => {
    setIsPressed(true);
    setStartPoint(svgProps.shadowPadding);
  })
  .onTouchesUp(() => {
    setIsPressed(false);
    setStartPoint(0);
    props.onPress();
  })
  .onFinalize(() => {
    setIsPressed(false);
    setStartPoint(0);
    props.onPress();
  });

  return (
    <GestureHandlerRootView>
      <View>
        <GestureDetector gesture={tap}>
          <Canvas style={{ width: svgProps.size+ Padding, height: svgProps.size + Padding}}>
            <FitBox src={rect(0, 0, icon.width(), icon.height())} dst={rect(svgProps.shadowPadding, svgProps.shadowPadding, svgProps.size, svgProps.size)}>
              <ImageSVG svg={iconShadow} />
            </FitBox>
            <FitBox src={rect(0, 0, iconShadow.width(), iconShadow.height())} dst={rect(startPoint, startPoint, svgProps.size, svgProps.size)}>
              <ImageSVG svg={icon} />
            </FitBox>
            {ic && <FitBox src={rect(0, 0, ic.width(), ic.height())} dst={rect(svgProps.iconXPadding + startPoint, svgProps.iconYPadding + startPoint, svgProps.size, svgProps.size)}>
              <ImageSVG svg={ic} />
            </FitBox>}
          </Canvas>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );

};

export default IconButton;
