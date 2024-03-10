import { SkFont, rect, Group, fitbox, ImageSVG, Text } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import useSvgProvider from "../../common/SvgProvider";

type SliderControlProps = {
  icon: string;
  //svgProps: SVGProps;
  value: SharedValue<number>;
  xPos: SharedValue<number>;
  font: SkFont;
}


export const SliderControl = (props: SliderControlProps) => {
  const iconProvider = useSvgProvider();
  const icon = iconProvider.getSvg('cat_head', 'white');
  const iconShadow = iconProvider.getSvg('cat_head', 'black');
  const controlValueText = useDerivedValue(() => {
    return props.value.value.toString();
  });

  const shadowPadding = 2;
  const size = 40;
  const textWidth = useDerivedValue(() => {
    return props.font?.measureText(controlValueText.value).width || 30;
  });
  const text_x_pos = useDerivedValue(() => {
    return props.xPos.value + size / 2 - textWidth.value / 2;
  })

  const textShadow_x_pos = useDerivedValue(() => {
    return text_x_pos.value + shadowPadding;
  })

  const icon_x_pos = useDerivedValue(() => {
    return props.xPos.value;
  })

  const iconShadow_x_pos = useDerivedValue(() => {
    return props.xPos.value + shadowPadding;
  })

  const iconFitBox = {
    src: rect(0, 0, 40, 40),
    dst: rect(0, 0, 40, 40)
  }

  return (
    <>
      <Group transform={fitbox("contain", iconFitBox.src, iconFitBox.dst)}>
        <ImageSVG svg={iconShadow} x={iconShadow_x_pos} y={0 + shadowPadding} width={20} height={20} />
      </Group>
      <Group transform={fitbox("contain", iconFitBox.src, iconFitBox.dst)}>
        <ImageSVG svg={icon} x={icon_x_pos} y={0} width={20} height={20} />
      </Group>
      <Text x={textShadow_x_pos} y={30+ shadowPadding} text={controlValueText} font={props.font} color='black'/>
      <Text x={text_x_pos} y={30} text={controlValueText} font={props.font} color='lightgray'/>
    </>
  )
}
