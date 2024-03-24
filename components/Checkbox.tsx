import React, { useEffect, useState } from 'react';
import IconButton from './IconButton';
import TextWithShadow from './TextWithShadow';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
});

type Props = {
  checked: boolean;
  onToggle: () => void;
  title?: string;
  disabled?: boolean;
}

const Checkbox = (props: Props) => {
  return (
    <View style={styles.container}>
      {props.checked === true  && <IconButton
          size="small"
          type='checkbox_check'
          onPress={props.onToggle}
          disabled={props.disabled}
          />
      }
      {props.checked !== true  && <IconButton
          size="small"
          type='checkbox'
          onPress={props.onToggle}
          disabled={props.disabled}
          />
      }
      {props.title && <TextWithShadow value={props.title} />}
    </View>
  );
};

export default Checkbox;
