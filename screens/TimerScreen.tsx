import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import IconButton from '../components/IconButton';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  }
});

const TimerScreen = () => {
  const navigation = useNavigation();
  const [state, setState] = useState<string>();

  useEffect(() => {
    setState('');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#ff4081', paddingTop: Constants.statusBarHeight}}>
      <Text>Timer</Text>
      <View style={{margin: 20, position: 'absolute', top: Constants.statusBarHeight, right: 0}}>
        <IconButton size="medium" type="settings" onPress={() => navigation.navigate('Settings')} />
      </View>
    </View>
  );

};

export default TimerScreen;
