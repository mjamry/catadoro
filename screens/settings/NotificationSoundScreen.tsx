import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { useColorsStore } from '../../state/AppColors';
import { ChannelIds, useNotificationChannelIdStore } from '../../state/AppNotifications';
import Checkbox from '../../components/Checkbox';
import NavigationButton from '../../components/NavigationButton';
import { Routes } from '../../common/Routes';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: Constants.statusBarHeight + 50
  }
});

const NotificationSoundScreen = () => {
  const background = useColorsStore(s => s.background);
  const notificationChannelId = useNotificationChannelIdStore(s => s.notificationChannelId);
  const setNotificationChannelId = useNotificationChannelIdStore(s => s.setNotificationChannelId);

  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <NavigationButton icon={'clock'} route={Routes.home} />
      {ChannelIds.map((channelId, index) => (
        <Checkbox
          checked={notificationChannelId === channelId}
          onToggle={() => setNotificationChannelId(channelId)}
          title={`sound ${index + 1}`}
          key={channelId}
        />
      ))}
    </View>
  );
};

export default NotificationSoundScreen;