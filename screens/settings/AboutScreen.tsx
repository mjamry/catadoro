import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import TextWithShadow from '../../components/TextWithShadow';
import { Routes } from '../../Routes';
import NavigationButton from '../../components/NavigationButton';
import { useColorsStore } from '../../state/AppColors';
import MultilineTextWithShadow from '../../components/MultilineTextWithShadow';

const Description = "All in all, it's to ensure\nthat while toiling away for kitty grub,\nyou don't forget to carve out\ntime for play and relaxation.\nRemember, a happy cat means a happier you,\nand who doesn't want that\nextra purr of approval\nin life's grand meow-nage?";

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

export const AboutScreen = () => {
  const background = useColorsStore(s => s.background);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <NavigationButton icon={'clock'} route={Routes.home} />
      <TextWithShadow value={Constants.expoConfig.name} fontSize={35} padding={20} color="white" />
      <TextWithShadow value={`version: ${Constants.expoConfig.version}`} />
      <MultilineTextWithShadow value={Description} fontSize={12}/>
    </View>
  );
}
