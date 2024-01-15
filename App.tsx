import * as React from 'react';
import { Button, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import SettingsScreen from './screens/SettingsScreen';
import TimerScreen from './screens/TimerScreen';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

function AppContent() {

  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}
    >
      <Stack.Screen
        name="Home"
        component={TimerScreen}
      />
      <Stack.Screen
        name="Settings"
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