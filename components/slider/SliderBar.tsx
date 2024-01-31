import { SkFont, Skia, Path, Text } from "@shopify/react-native-skia";

type SliderBarProps = {
  width: number;
  title: string;
  font: SkFont;
}

export const SliderBar = (props: SliderBarProps) => {
  const shadowPadding = 2;
  const sliderStartPadding = 12;
  const y_pos = 40;
  const x_pos = sliderStartPadding;
  const lineWidth = 15;
  const path = Skia.Path.Make();
  path.moveTo(x_pos, y_pos);
  path.lineTo(props.width - x_pos, y_pos);
  path.close();

  const pathShadow = Skia.Path.Make();
  pathShadow.moveTo(x_pos + shadowPadding, y_pos + shadowPadding);
  pathShadow.lineTo(props.width - x_pos + shadowPadding, y_pos + shadowPadding);
  pathShadow.close();

  const titleWidth = props.font?.getTextWidth(props.title ?? '') ?? 0;
  return (
    <>
      <Path path={pathShadow} color='black' strokeWidth={lineWidth} style="stroke" strokeJoin="round"/>
      <Path path={path} color="white" strokeWidth={lineWidth} style="stroke" strokeJoin="round"/>
      {props.title && <>
        <Text x={props.width / 2 - titleWidth / 2 + shadowPadding} y={70 + shadowPadding} text={props.title} font={props.font} color='black'/>
        <Text x={props.width / 2 - titleWidth / 2} y={70} text={props.title} font={props.font} color='lightgray'/>
      </>}
  </>
  )
}