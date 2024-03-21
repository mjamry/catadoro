import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Routes } from '../common/Routes';
import NavigationButton from '../components/NavigationButton';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: Constants.statusBarHeight + 50
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  }
});

const ErrorScreen = () => {
  const [state, setState] = useState<string>();

  useEffect(() => {
    setState('');
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: 'red'}]}>
      <NavigationButton icon={'clock'} route={Routes.home} />
      <Text>Sorry.. there was an error</Text>
    </View>
  );

};

export default ErrorScreen;
