import { Canvas, Fill, Circle, FitBox, rect, ImageSVG, Group, fitbox } from '@shopify/react-native-skia';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import useSvgProvider, { SvgIconType, SvgType } from '../SvgProvider';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';

type Size = 'small' | 'medium' | 'large';
type SvgProps = {
  shadowPadding: number;
  size: number;
  iconXPadding: number;
  iconYPadding: number;
  margin: number;
}

type IconProps = {
  size: Size;
  type: SvgIconType;
  onPress: () => void;
  disabled?: boolean;
}

const getDimensions = (size: Size): SvgProps => {
  switch (size) {
    case 'large':
      return {
        shadowPadding: 2,
        size: 80,
        iconXPadding: 8,
        iconYPadding: 12,
        margin: 14,
      };
    case 'medium':
      return {
        shadowPadding: 2,
        size: 60,
        iconXPadding: 9,
        iconYPadding: 11,
        margin: 10,
      };
    case 'small':
    default:
      return {
        shadowPadding: 2,
        size: 40,
        iconXPadding: 8,
        iconYPadding: 10,
        margin: 8,
      };
  }
}

const defaultIconSize = 40;

const IconButton = (props: IconProps) => {
  const iconProvider = useSvgProvider();
  const button = iconProvider.getSvg('cat_head', props.disabled ? 'gray' : 'white');
  const buttonShadow = iconProvider.getSvg('cat_head', 'black');
  const icon = iconProvider.getIcon(props.type);
  const startPoint = useSharedValue(0);

  const buttonDimensions = getDimensions(props.size);
  const buttonFitBox = useDerivedValue(() => {
    return {
      src: rect(0, 0, button?.width() || defaultIconSize, button?.height() || defaultIconSize),
      dst: rect(0, 0, buttonDimensions.size, buttonDimensions.size)
    }
  })

  const iconFitBox = useDerivedValue(() => {
    return {
      src: rect(0, 0, icon?.width() || defaultIconSize, icon?.height() || defaultIconSize),
      dst: rect(0, 0, buttonDimensions.size, buttonDimensions.size)
    }
  })

  const tap = Gesture.Tap()
  .onTouchesDown(() => {
    startPoint.value = buttonDimensions.shadowPadding;
  })
  .onTouchesUp(() => {
    startPoint.value = 0;
    runOnJS(props.onPress)();
  })
  .onFinalize(() => {
    startPoint.value = 0;
  });

  const disabledTap = Gesture.Tap();

  const icon_x_pos = useDerivedValue(() => {
    return buttonDimensions.iconXPadding + startPoint.value;
  })

  const icon_y_pos = useDerivedValue(() => {
    return buttonDimensions.iconYPadding + startPoint.value;
  })

  return (
    <GestureHandlerRootView>
      <View>
        <GestureDetector gesture={props.disabled ? disabledTap : tap}>
          <Canvas style={{ width: buttonDimensions.size + buttonDimensions.margin, height: buttonDimensions.size + buttonDimensions.margin}}>
            <Group transform={fitbox("contain", buttonFitBox.value.src, buttonFitBox.value.dst)}>
              <ImageSVG
                svg={buttonShadow}
                x={buttonDimensions.shadowPadding}
                y={buttonDimensions.shadowPadding}
            />
            </Group>
            <Group transform={fitbox("contain", buttonFitBox.value.src, buttonFitBox.value.dst)}>
              <ImageSVG
                svg={button}
                x={startPoint}
                y={startPoint}
              />
            </Group>
            {icon &&
              <Group transform={fitbox("contain", iconFitBox.value.src, iconFitBox.value.dst)}>
              <ImageSVG
                svg={icon}
                x={icon_x_pos}
                y={icon_y_pos}
              />
            </Group>
            }
          </Canvas>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

export default IconButton;
