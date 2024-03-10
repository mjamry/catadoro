import { Canvas, Group, ImageSVG, Path, SkRect, Skia, fitbox, processTransform2d, rect } from '@shopify/react-native-skia';
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ReduceMotion, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { AppState, useAppStateStore } from '../state/AppState';
import useSvgProvider, { FaceType, PatchType } from '../common/SvgProvider';
import { OutlineColor, OutlineProgressColor, getRandomHeadColor, getRandomPatchColor } from '../common/Colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export const fitRect = (src: SkRect, dst: SkRect) =>
  processTransform2d(fitbox("contain", src, dst));

type TimerProps = {
  width: number;
  height: number;
}

const NumberOfPatches = 4;

const Timer = (props: TimerProps) => {
  const { width, height } = props;
  const padding = 20;
  const pathWidth = 12;
  const widthWithPadding = width ;
  const heightWithPadding = height - pathWidth*2;

  const iconProvider = useSvgProvider();

  const iconForeground = iconProvider.getSvg('cat_head', 'yellow');
  const src = rect(0, 0, iconForeground.width(), iconForeground.height());
  const dst = rect(0, pathWidth, widthWithPadding, heightWithPadding);

  const progress = useSharedValue(0);
  const totalCountdown = useRef(0);
  const faceType = useRef<FaceType>('face_normal');
  const patchType = useRef<PatchType>('patch_4');
  const currentState = useRef<AppState>('idle');
  const headColor = useRef<string>(getRandomHeadColor());
  const patchColor = useRef<string>(getRandomPatchColor());

  const renderHead = () => {
    const catHead = iconProvider.getSvg('cat_head', headColor.current);

    return (
      <Group transform={fitbox("contain", src, dst)}>
        <ImageSVG svg={catHead} x={0} y={0} />
      </Group>
    )
  }

  const getFaceType = (progress: number): FaceType => {
    //idle
    if(currentState.current === 'idle'){
      return 'face_normal';
    }

    //break
    if(currentState.current !== 'work'){
      return 'face_happy';
    }

    //work
    if(progress >= 0 && progress < 0.5){
      return 'face_normal';
    }
    if(progress >= 0.5 && progress < 0.9){
      return 'face_sad';
    }
    if(progress >= 0.9){
      return 'face_angry';
    }
  }

  const renderFace = () => {
    const faceSvg = iconProvider.getSvg(faceType.current);

    return (
      <Group transform={fitbox("contain", src, dst)}>
        <ImageSVG svg={faceSvg} x={0} y={0} />
      </Group>
    )
  }

  const renderFaceOutline = () => {
    const path = iconProvider.getPath('cat_head_outline');
    const src1 = path.computeTightBounds();
    const m3 = fitRect(src1, dst);
    path.transform(m3);

    return (
      <Path path={path} color={OutlineColor} style="stroke" strokeWidth={pathWidth}/>
    )
  }

  const renderPatch = () => {
    const patchSvg = iconProvider.getSvg(patchType.current, patchColor.current);

    return (
      <>
      <Group transform={fitbox("contain", src, dst)}>
        <ImageSVG svg={patchSvg} x={0} y={0} />
      </Group>
      </>
    )
  }

  const renderPath = () => {
    const path = iconProvider.getPath('cat_head_outline');
    const src1 = path.computeTightBounds();
    const m3 = fitRect(src1, dst);
    path.transform(m3);

    return (
      <Path path={path} color={OutlineProgressColor} style="stroke" strokeWidth={pathWidth} start={0} end={progress}/>
    )
  }

  const handleCountdown = (currentCountdown: number) => {
    let currentProgress = 0;
    if(totalCountdown.current === currentCountdown){
      progress.value = 0
    } else {
      currentProgress = ((totalCountdown.current - currentCountdown + 1)/totalCountdown.current);
      progress.value = withTiming(currentProgress, {
        duration: 1500,
        easing: Easing.inOut(Easing.linear),
        reduceMotion: ReduceMotion.System,
      })
    }

    faceType.current = getFaceType(currentProgress);
  }
  
  useEffect(() => {
    const countdownSub = useAppStateStore.subscribe((s) => s.countdown, handleCountdown);
    const totalSub = useAppStateStore.subscribe((s) => s.totalCountdown, (state) => totalCountdown.current = state);
    const stateSub = useAppStateStore.subscribe((s) => s.currentState, (state) => {
      currentState.current = state;
      if(state === 'work'){
        patchType.current = `patch_${Math.floor(Math.random() * NumberOfPatches + 1)}` as PatchType;
        headColor.current = getRandomHeadColor();
        patchColor.current = getRandomPatchColor();
      }
    });

    return () => {
      countdownSub();
      totalSub();
      stateSub();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={{ width: width, height: height }}>
        {renderHead()}
        {renderPatch()}
        {renderFace()}
        {renderFaceOutline()}
        {renderPath()}
      </Canvas>
    </View>
  );

};

export default Timer;
