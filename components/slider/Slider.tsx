import { Canvas, FitBox, rect, ImageSVG, Skia, Path, Text, useFont, Circle, SkSVG, fitbox, Group, SkRect, SkFont } from '@shopify/react-native-skia';
import React, { SVGProps, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import IconButton from '../IconButton';
import useSvgProvider from '../../SvgProvider';
import { AnimatedProps, SharedValue, runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { SliderBar } from './SliderBar';
import { SliderControl } from './SliderControl';

type SliderProps = {
  width: number;
  range: {min: number; max: number};
  step: number;
  initialValue: number;
  onChange: (value: number) => void;
  title?: string;
}

const Slider = (props: SliderProps) => {
  const { width, step, range, initialValue, onChange, title } = props;

  const sliderValue = useSharedValue(initialValue);
  const canChange = useSharedValue(false);

  const iconWidth= 40;

  const sliderStart = 0;
  const sliderEnd = width - iconWidth;
  const sliderWidth = sliderEnd - sliderStart;
  const stepWidth = sliderWidth / ((range.max - range.min) / step);
  const control_y_pos = 0;

  const x_pos = useDerivedValue(() => {
    return ((sliderValue.value - range.min) / step) * stepWidth;
  });
  const fontHeight = 22;
  const font = useFont(require("./../../assets/WickedMouse-aGoK.ttf"), fontHeight);
  const titleHeight = fontHeight;

  const height = title !== undefined ? 60 + titleHeight : 60;

  const panGesture = Gesture.Pan()
  .minDistance(1)
  .onFinalize(() => {
    canChange.value = false;
    runOnJS(onChange)(sliderValue.value);
  })
  .onChange((e) => {
    if (
      e.x > x_pos.value - iconWidth &&
      e.x < x_pos.value + iconWidth &&
      e.y > control_y_pos - iconWidth &&
      e.y < control_y_pos + iconWidth
    ) {
      canChange.value = true;
    } else {
      canChange.value = false;
    }
    if(canChange.value){
      const x = e.x + sliderStart;
      const newValue = Math.floor(x / stepWidth) * step + range.min;
      if(newValue >= range.min && newValue <= range.max){
        sliderValue.value = newValue;
      }
    }
  });

  const handlePlusPress = () => {
    if(sliderValue.value <= range.max - step){
      setNewValue(sliderValue.value + step);
    }
  }

  const handleMinusPress = () => {
    if(sliderValue.value >= range.min + step) {
      setNewValue(sliderValue.value - step);
    }
  }

  const setNewValue = (value: number) => {
    sliderValue.value = value;
    onChange(value);
  }

  return (
    <GestureHandlerRootView>
      <View style={{display: 'flex', flexDirection: 'row'}}>
      <View style={{paddingTop: 20}}>
        <IconButton size="small" type="minus" onPress={handleMinusPress} />
      </View>
        <GestureDetector gesture={panGesture}>
          <Canvas style={{ width: width, height: height}}>
            <SliderBar width={width} title={props.title} font={font}/>
            <SliderControl xPos={x_pos} icon={''} value={sliderValue} font={font}/>
          </Canvas>
        </GestureDetector>
        <View style={{paddingTop: 20}}>
          <IconButton size="small" type="plus" onPress={handlePlusPress} />
        </View>
      </View>
    </GestureHandlerRootView>
  );

};

export default Slider;
