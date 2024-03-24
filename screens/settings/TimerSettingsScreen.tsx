import React, { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions, Button } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Canvas, Circle, Fill, Path, ImageSVG, Skia, Group, fitbox, rect, FitBox } from '@shopify/react-native-skia';
import Constants from 'expo-constants';
import IconButton from '../../components/IconButton';
import Slider from '../../components/slider/Slider';
import { NavigationProps } from '../RootScreenParams';
import { Routes } from '../../common/Routes';
import { useTimersStore } from '../../state/AppTimers';
import NavigationButton from '../../components/NavigationButton';
import { useColorsStore } from '../../state/AppColors';
import { useAppSettingsStore } from '../../state/AppSettings';
import Checkbox from '../../components/Checkbox';

const TimerSettingsScreen = () => {
  const work = useTimersStore(s => s.work);
  const shortBreak = useTimersStore(s => s.shortBreak);
  const longBreak = useTimersStore(s => s.longBreak);
  const setWork = useTimersStore(s => s.setWork);
  const setShortBreak = useTimersStore(s => s.setShortBreak);
  const setLongBreak = useTimersStore(s => s.setLongBreak);
  const background = useColorsStore(s => s.background);
  const keepScreenOn = useAppSettingsStore(s => s.keepScreenOn);
  const setKeepScreenOn = useAppSettingsStore(s => s.setKeepScreenOn);

  return (
    <>
      <View style={{ flex: 1, paddingTop: Constants.statusBarHeight * 2, backgroundColor: background}}>
        <NavigationButton icon={'clock'} route={Routes.home} />
        <View style={{marginTop: Constants.statusBarHeight + 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Slider
            width={200}
            step={5}
            range={{min: 10, max: 60}}
            initialValue={work}
            onChange={(value) => setWork(value)}
            title="work time"/>
        </View>
        <View style={{marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Slider
            width={200}
            step={1}
            range={{min: 1, max: 10}}
            initialValue={shortBreak}
            onChange={(value) => setShortBreak(value)}
            title="short break"/>
        </View>
        <View style={{marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Slider
            width={200}
            step={5}
            range={{min: 5, max: 20}}
            initialValue={longBreak}
            onChange={(value) => setLongBreak(value)}
            title="long break"/>
        </View>
        <View style={{marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Checkbox
            checked={keepScreenOn}
            onToggle={() => setKeepScreenOn(!keepScreenOn)}
            title="Keep Screen On"
          />
        </View>
      </View>
    </>
  );

};

export default TimerSettingsScreen;
