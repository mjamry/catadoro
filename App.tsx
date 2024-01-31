import * as React from 'react';
import { Button, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import SettingsScreen from './screens/SettingsScreen';
import TimerScreen from './screens/TimerScreen';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Routes } from './Routes';
import { RootScreenParams } from './screens/RootScreenParams';

const Stack = createStackNavigator<RootScreenParams>();

function AppContent() {

  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}
    initialRouteName={Routes.home}
    >
      <Stack.Screen
        name={Routes.home}
        component={TimerScreen}
      />
      <Stack.Screen
        name={Routes.settings}
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
}

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <AppContent />
    </NavigationContainer>
  );
}

export default App;