import * as React from 'react';
import { Text, useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import TimerSettingsScreen from './TimerSettingsScreen';
import { AboutScreen } from './AboutScreen';
import ColorsSettingsScreen from './ColorsSettingsScreen';
import Constants from 'expo-constants';
import { useColorsStore } from '../../state/AppColors';
import TextWithShadow from '../../components/TextWithShadow';

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
});

export const SettingsScreen = () => {
  const layout = useWindowDimensions();
  const background = useColorsStore(s => s.background);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'timers', title: 'Timers' },
    { key: 'colors', title: 'Colors' },
    { key: 'about', title: 'About' },
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'black' }}
      style={{ backgroundColor: background }}
      renderLabel={({ route, focused, color }) => (
        <TextWithShadow value={route.title} />
      )}
    />
  );

  return (
    <TabView
      tabBarPosition='bottom'
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}