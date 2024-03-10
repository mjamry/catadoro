import { create } from "zustand";
import * as SecureStore from 'expo-secure-store';
import { defaultNotificationChannelId, notificationChannelIdKey } from "./SettingsConsts";

export const ChannelIds = [
  'catadoro_notification_1',
  'catadoro_notification_2',
  'catadoro_notification_3',
  'catadoro_notification_4',
  'catadoro_notification_5',
  'catadoro_notification_6',
  'catadoro_notification_7',
] as const;

export type NotificationChannelId = typeof ChannelIds[number];

type NotificationChannelIdStore = {
  notificationChannelId: NotificationChannelId;
  setNotificationChannelId: (value: NotificationChannelId) => void;
}

export const useNotificationChannelIdStore = create<NotificationChannelIdStore>((set) => ({
  notificationChannelId: defaultNotificationChannelId,
  setNotificationChannelId: (value: NotificationChannelId) => {
    set({ notificationChannelId: value});
    SecureStore.setItemAsync(notificationChannelIdKey, value.toString());
  },
}))

SecureStore.getItemAsync(notificationChannelIdKey).then((value) =>
  useNotificationChannelIdStore.setState({ notificationChannelId: value ? value as NotificationChannelId : defaultNotificationChannelId })
);