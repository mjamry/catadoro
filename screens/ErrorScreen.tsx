import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Routes } from '../common/Routes';
import NavigationButton from '../components/NavigationButton';
import Constants from 'expo-constants';
import { useColorsStore } from '../state/AppColors';
import TextWithShadow from '../components/TextWithShadow';
import IconButton from '../components/IconButton';
import { useEnvironmentStore } from '../state/Environment';
import { useNavigation } from '@react-navigation/native';
import useUseShareLogs from '../common/ShareLogsButton';
import { NavigationProps } from './RootScreenParams';
import { Canvas, Group, ImageSVG, fitbox, rect } from '@shopify/react-native-skia';
import useSvgProvider from '../common/SvgProvider';

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

type Props = {
  error?: string;
}

const ErrorScreen = (props: Props) => {
  const background = useColorsStore(s => s.background);
  const buildType = useEnvironmentStore(s => s.buildType);
  const nav = useNavigation<NavigationProps>();
  const share = useUseShareLogs();

  const iconProvider = useSvgProvider();

  const iconForeground = iconProvider.getSvg('cat_head', 'yellow');
  const src = rect(0, 0, iconForeground.width(), iconForeground.height());
  const dst = rect(0, 12, 100, 100);

  const renderHead = () => {
    const catHead = iconProvider.getSvg('cat_head');
    const faceSvg = iconProvider.getSvg('face_angry');

    return (
      <Group transform={fitbox("contain", src, dst)}>
        <ImageSVG svg={catHead} x={0} y={0} />
        <ImageSVG svg={faceSvg} x={0} y={0} />
      </Group>
    )
  }

  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <NavigationButton icon={'clock'} route={Routes.home} />
      <Canvas style={{ width: 100, height: 150 }}>
        {renderHead()}
      </Canvas>
      <TextWithShadow value={'Ups...'}></TextWithShadow>
      <TextWithShadow value={'Houston, we have a problem'} fontSize={12}></TextWithShadow>
      <View style={styles.row}>
        <IconButton size={'small'} type={'share'} onPress={() => share()} />
        {buildType !== 'PROD' && <IconButton size={'small'} type={'bug'} onPress={() => nav.navigate(Routes.debug)} />}
      </View>
      {buildType !== 'PROD' && <View>
        <Text>{props.error}</Text>
      </View>}
    </View>
  );

};

export default ErrorScreen;
