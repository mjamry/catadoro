import * as React from 'react';
import { Button, Platform, StatusBar, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import TimerSettingsScreen from './screens/settings/TimerSettingsScreen';
import TimerScreen from './screens/TimerScreen';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Routes } from './common/Routes';
import { RootScreenParams } from './screens/RootScreenParams';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { SettingsScreen } from './screens/settings/SettingsScreen';
import { useColorsStore } from './state/AppColors';
import { ChannelIds, useNotificationChannelIdStore } from './state/AppNotifications';
import { NotificationChannel } from 'expo-notifications';
import { useEnvironmentStore } from './state/Environment';
import {
  setJSExceptionHandler,
} from 'react-native-exception-handler';
import ErrorScreen from './screens/ErrorScreen';
import DebugScreen from './screens/DebugScreen';
import useLoggerService from './services/logger/LoggerService';

function PrepareNotificationChannels(): Promise<NotificationChannel>[]{
  let output: Promise<NotificationChannel>[] = [];
  ChannelIds.forEach((channelId) => {
    output.push(Notifications.setNotificationChannelAsync(channelId, {
      name: channelId,
      importance: Notifications.AndroidImportance.HIGH,
      sound: `${channelId}.wav`,
      vibrationPattern: [0, 255, 255, 255, 0, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    }));
  })

  return output;
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Promise.all(PrepareNotificationChannels());
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

// Use config for this
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Handle JS errors
setJSExceptionHandler((error, isFatal) => {
  console.log('JS Error handler',isFatal, error);
}, true);

const Stack = createStackNavigator<RootScreenParams>();

function AppContent() {
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const log = useLoggerService('App');

  const buildType = useEnvironmentStore(s => s.buildType);
  React.useEffect(() => {
    log.debug(`Build Type: ${buildType}`, buildType, process.env);
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
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
      <Stack.Screen
        name={Routes.error}
        component={ErrorScreen}
      />
      <Stack.Screen
        name={Routes.debug}
        component={DebugScreen}
      />
    </Stack.Navigator>
  );
}

function App(): JSX.Element {
  const background = useColorsStore(s => s.background);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={background} />
        <AppContent />
    </NavigationContainer>
  );
}

export default App;