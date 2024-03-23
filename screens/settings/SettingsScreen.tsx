import * as React from 'react';
import { Text, useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import TimerSettingsScreen from './TimerSettingsScreen';
import { AboutScreen } from './AboutScreen';
import ColorsSettingsScreen from './ColorsSettingsScreen';
import Constants from 'expo-constants';
import { useColorsStore } from '../../state/AppColors';
import TextWithShadow from '../../components/TextWithShadow';
import NotificationSoundScreen from './NotificationSoundScreen';
import { SvgIconType } from '../../common/SvgProvider';
import IconButton from '../../components/IconButton';
import ErrorBoundary from '../../ErrorBoundary';

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

const renderScene = SceneMap({
  timers: TimerSettingsScreen,
  colors: ColorsSettingsScreen,
  about: AboutScreen,
  sounds: NotificationSoundScreen
});

export const SettingsScreen = () => {
  const layout = useWindowDimensions();
  const background = useColorsStore(s => s.background);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'timers', title: 'Timers', icon: 'clock' },
    { key: 'colors', title: 'Colors', icon: 'color' },
    { key: 'sounds', title: 'Sounds', icon: 'sound' },
    { key: 'about', title: 'About', icon: 'info' },
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'black' }}
      style={{ backgroundColor: background }}
      renderLabel={({ route, focused, color }) => (
        <IconButton size={'small'} type={route.icon as SvgIconType} onPress={() => {}} />
      )}
    />
  );

  return (
    <ErrorBoundary>
      <TabView
        tabBarPosition='bottom'
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        />
    </ErrorBoundary>
  );
}