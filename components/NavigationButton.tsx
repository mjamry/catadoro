import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Routes } from '../Routes';
import { NavigationProps } from '../screens/RootScreenParams';
import { useNavigation } from '@react-navigation/native';
import IconButton from './IconButton';
import { View } from 'react-native';
import { SvgIconType } from '../SvgProvider';

type NavigationButtonProps = {
  icon: SvgIconType,
  route: Routes,
}

const NavigationComponent = (props: NavigationButtonProps) => {
  const nav = useNavigation<NavigationProps>();

  return (
    <View style={{margin: 10, position: 'absolute', top: Constants.statusBarHeight, right: 0}}>
      <IconButton size="medium" type={props.icon} onPress={() => nav.navigate(props.route)} />
    </View>
  );
};

export default NavigationComponent;
