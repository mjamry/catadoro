import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import IconButton from './IconButton';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
});

type ColorPickerProps = {
  colors: string[];
  selected: string;
  onSelected: (color: string) => void;
}

const ColorPicker = (props: ColorPickerProps) => {
  const colorSize = 40;

  const renderColor = (color: string) => {
    let isSelected = false;
    if(props.selected === color){
      isSelected = true;
    }
    return (
      <View style={{
        borderColor: 'black',
        margin: 10,
        borderWidth: isSelected ? 2 : 0,
        padding: 0,
        backgroundColor: isSelected ? 'white' : props.selected
      }}>
        <IconButton backgroundColor={color} size={'small'} type={'clock'} onPress={() => props.onSelected(color)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      { props.colors.map((color) => renderColor(color)) }
    </View>
  );

};

export default ColorPicker;
