import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTimersStore } from '../AppTimers';

const SettingsScreen = () => {
  const work = useTimersStore(s => s.work);
  const shortBreak = useTimersStore(s => s.shortBreak);
  const longBreak = useTimersStore(s => s.longBreak);

  return (
    <View style={{ flex: 1}}>
      <Text>Work {work}</Text>
      <Text>short break {shortBreak}</Text>
      <Text>long break {longBreak}</Text>
    </View>
  );

};

export default SettingsScreen;
