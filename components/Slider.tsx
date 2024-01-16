import { Canvas, FitBox, rect, ImageSVG, Skia, Path, Text, useFont, Circle } from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import IconButton from './IconButton';
import useSvgProvider from '../SvgProvider';

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
  const [value, setValue] = useState(initialValue);
  const [canChange, setCanChange] = useState(false);
  const fontHeight = 22;
  const font = useFont(require("./../assets/WickedMouse-aGoK.ttf"), fontHeight);

  const shadowPadding = 2;
  const iconProvider = useSvgProvider();
  const icon = iconProvider.getSvg('cat_head', 'white');
  const iconShadow = iconProvider.getSvg('cat_head', 'black');

  const iconWidth = 40;
  const sliderStart = 0;
  const sliderStartPadding = 12;
  const sliderEnd = width - iconWidth;
  const sliderWidth = sliderEnd - sliderStart;
  const stepWidth = sliderWidth / ((range.max - range.min) / step);
  const control_y_pos = 0;

  const titleHeight = fontHeight;

  const height = title !== undefined ? 60 + titleHeight : 60;

  const calc_x_pos = (value: number) => {
    return ((value - range.min) / step) * stepWidth;
  };

  const panGesture = Gesture.Pan()
  .minDistance(1)
  .onStart((e) => {
    const x_pos = calc_x_pos(value);

    if (
      e.x > x_pos - iconWidth &&
      e.x < x_pos + iconWidth &&
      e.y > control_y_pos - iconWidth &&
      e.y < control_y_pos + iconWidth
    ) {
      setCanChange(true);
    }
  })
  .onEnd(() => {
    setCanChange(false);
    onChange(value);
  })
  .onUpdate((e) => {
    if(canChange){
      const x = e.x + sliderStart;
      const newValue = Math.floor(x / stepWidth) * step + range.min;
      const newValueReal_x_pos = calc_x_pos(newValue);
      if(newValue >= range.min && newValue <= range.max){
        setValue(newValue);
      }
    }
  });
  
  const renderSlider = () => {
    const y_pos = 40;
    const x_pos = sliderStartPadding;
    const lineWidth = 15;
    const path = Skia.Path.Make();
    path.moveTo(x_pos, y_pos);
    path.lineTo(width - x_pos, y_pos);
    path.close();

    const pathShadow = Skia.Path.Make();
    pathShadow.moveTo(x_pos + shadowPadding, y_pos + shadowPadding);
    pathShadow.lineTo(width - x_pos + shadowPadding, y_pos + shadowPadding);
    pathShadow.close();
    
    const titleWidth = font?.getTextWidth(title ?? '') ?? 0;

    return (
      <>
        <Path path={pathShadow} color='black' strokeWidth={lineWidth} style="stroke" strokeJoin="round"/>
        <Path path={path} color="white" strokeWidth={lineWidth} style="stroke" strokeJoin="round"/>
        {title && <>
          <Text x={width / 2 - titleWidth / 2 + shadowPadding} y={70 + shadowPadding} text={title} font={font} color='black'/>
          <Text x={width / 2 - titleWidth / 2} y={70} text={title} font={font} color='lightgray'/>
        </>}
      </>
    )
  }

  const renderControl = (value: number) => {
    const size = 40;
    const text = value.toString();
    const textWidth = font?.getTextWidth(text) ?? 0;
    const x_pos = calc_x_pos(value);

    return (
      <>
        <FitBox src={rect(0, 0, icon.width(), icon.height())} dst={rect(x_pos + shadowPadding, 0 + shadowPadding, size, size)}>
          <ImageSVG svg={iconShadow} />
        </FitBox>
        <FitBox src={rect(0, 0, iconShadow.width(), iconShadow.height())} dst={rect(x_pos, 0, size, size)}>
          <ImageSVG svg={icon} color='gray' />
        </FitBox>
        <Text x={x_pos + size / 2 - textWidth / 2 + shadowPadding} y={30+ shadowPadding} text={text} font={font} color='black'/>
        <Text x={x_pos + size / 2 - textWidth / 2} y={30} text={text} font={font} color='lightgray'/>
      </>
    )
  }

  const renderPoint = (x_pos: number) => {
    const radius = 8;
    return (
      <>
        <Circle cx={x_pos + shadowPadding} cy={40+ shadowPadding} r={radius} color='black' />
        <Circle cx={x_pos} cy={40} r={radius} color='white' />
      </>
    )
  }

  const handlePlusPress = () => {
    if(value <= range.max - step){
      setNewValue(value + step);
    }
  }

  const handleMinusPress = () => {
    if(value >= range.min + step) {
      setNewValue(value - step);
    }
  }

  const setNewValue = (value: number) => {
    setValue(value);
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
            { renderSlider() }
            { renderControl(value) }
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
