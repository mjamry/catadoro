import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const TimerPage = () => {
  const [state, setState] = useState<string>();

  useEffect(() => {
    setState('');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#ff4081'}}>
      <Text>Timer</Text>
    </View>
  );

};

export default TimerPage;
