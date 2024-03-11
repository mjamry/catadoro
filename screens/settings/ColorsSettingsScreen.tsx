import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ColorPicker from '../../components/ColorPicker';
import Constants from 'expo-constants';
import { useColorsStore } from '../../state/AppColors';
import NavigationButton from '../../components/NavigationButton';
import { Routes } from '../../common/Routes';
import TextWithShadow from '../../components/TextWithShadow';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'lightpink',
    paddingTop: Constants.statusBarHeight + 50
  },
});

const ColorsSettingsScreen = () => {
  const background = useColorsStore(s => s.background);
  const setBackgroundColor = useColorsStore(s => s.setBackground);

  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <NavigationButton icon={'clock'} route={Routes.home} />
      <TextWithShadow value='Background'/>
      <ColorPicker
        colors={['#606c38', '#dda15e', '#8ecae6', '#780000', '#ffafcc']}
        selected={background}
        onSelected={color => setBackgroundColor(color)}
      />
    </View>
  );

};

export default ColorsSettingsScreen;
