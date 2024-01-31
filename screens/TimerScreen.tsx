
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, Platform } from 'react-native';
import IconButton from '../components/IconButton';
import { Routes } from '../Routes';
import { NavigationProps } from './RootScreenParams';
import Playground from '../components/Playground';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  }
});

const TimerScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [state, setState] = useState<string>();

  useEffect(() => {
    setState('');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#ff4081', paddingTop: Constants.statusBarHeight}}>
      <Text>Timer</Text>
      <View style={{margin: 20, position: 'absolute', top: Constants.statusBarHeight, right: 0}}>
        <IconButton size="medium" type="settings" onPress={() => navigation.navigate(Routes.settings)} />
      </View>
    </View>
  );

};

export default TimerScreen;
