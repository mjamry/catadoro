import { NavigationProp } from '@react-navigation/native';

export type RootScreenParams = {
  home: undefined;
  settings: undefined;
  error: undefined;
  debug: undefined;
};

export type NavigationProps = NavigationProp<RootScreenParams>;