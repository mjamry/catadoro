import React, { useMemo } from 'react';
import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';
import { mascotColors } from '../../theme/tokens';
import { FaceName, earsPath, facePaths, headPath, mascotViewBox, outlinePath, tabbyPath } from './mascotPaths';

type MascotProps = {
  width: number;
  face: FaceName;
  // 0..1, drawn along the outline from the top centre, clockwise.
  progress: SharedValue<number> | number;
  progressColor: string;
};

// Widths in viewBox units (the head is 100 units wide).
const RimWidth = 7;
const InkWidth = 2;
const Padding = RimWidth / 2 + 1;

// Progress style P3: a cream rim sits outside the ink outline and fills with the accent colour.
// The rim and progress strokes are drawn under the head fill, so only their outer half shows.
const Mascot = ({ width, face, progress, progressColor }: MascotProps) => {
  const contentWidth = mascotViewBox.width + Padding * 2;
  const contentHeight = mascotViewBox.height + Padding * 2;
  const scale = width / contentWidth;
  const height = contentHeight * scale;

  const paths = useMemo(() => ({
    outline: Skia.Path.MakeFromSVGString(outlinePath)!,
    head: Skia.Path.MakeFromSVGString(headPath)!,
    ears: Skia.Path.MakeFromSVGString(earsPath)!,
    tabby: Skia.Path.MakeFromSVGString(tabbyPath)!,
  }), []);

  const faceLayers = useMemo(
    () => facePaths[face].map(layer => ({
      ...layer,
      path: Skia.Path.MakeFromSVGString(layer.d)!,
      // Face ink follows the app ink colour; other features keep their own colours.
      color: layer.id === 'ink' || layer.id === 'pupil' ? mascotColors.ink : layer.fill,
    })),
    [face],
  );

  return (
    <Canvas style={{ width, height }}>
      <Group transform={[{ scale }, { translateX: Padding }, { translateY: Padding }]}>
        <Path path={paths.outline} style="stroke" strokeWidth={RimWidth} strokeJoin="round" color={mascotColors.rim} />
        <Path
          path={paths.outline}
          style="stroke"
          strokeWidth={RimWidth}
          strokeJoin="round"
          strokeCap="butt"
          color={progressColor}
          start={0}
          end={progress}
        />
        <Path path={paths.head} color={mascotColors.fur} />
        <Path path={paths.tabby} color={mascotColors.stripes} />
        <Path path={paths.ears} color={mascotColors.ears} />
        {faceLayers.map(layer => (
          <Path key={`${face}-${layer.id}`} path={layer.path} color={layer.color} />
        ))}
        <Path path={paths.outline} style="stroke" strokeWidth={InkWidth} strokeJoin="round" color={mascotColors.ink} />
      </Group>
    </Canvas>
  );
};

export default Mascot;
