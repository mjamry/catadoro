import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  }
});

const TimerScreen = () => {
  const [state, setState] = useState<string>();

  useEffect(() => {
    setState('');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#ff4081', paddingTop: Constants.statusBarHeight}}>
      <Text>Timer</Text>
    </View>
  );

};

export default TimerScreen;
