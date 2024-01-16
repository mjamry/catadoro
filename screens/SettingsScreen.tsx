import React, { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions, Button } from 'react-native';
import { useTimersStore } from '../AppTimers';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Canvas, Circle, Fill, Path, ImageSVG, Skia, Group, fitbox, rect, FitBox } from '@shopify/react-native-skia';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../components/IconButton';

const svg = Skia.SVG.MakeFromString(
  `<svg viewBox='0 0 20 20' width="20" height="20" xmlns='http://www.w3.org/2000/svg'>
  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#323232" fill="#FFFFFF" stroke-width="2"/>
  <path d="M12 7L12 12" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M21 4L20 3" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
)!;

const Padding = 0;

const SettingsScreen = () => {
  const work = useTimersStore(s => s.work);
  const shortBreak = useTimersStore(s => s.shortBreak);
  const longBreak = useTimersStore(s => s.longBreak);
  const nav = useNavigation();

  return (
    <>
      <View style={{ flex: 1, paddingTop: Constants.statusBarHeight, backgroundColor: "green"}}>
        <Text>Work {work}</Text>
        <Text>short break {shortBreak}</Text>
        <Text>long break {longBreak}</Text>
        <View style={{margin: 20, position: 'absolute', top: Constants.statusBarHeight, right: 0}}>
          <IconButton size="medium" type="clock" onPress={() => nav.navigate('Home')} />
        </View>
      </View>
    </>
  );

};

export default SettingsScreen;
