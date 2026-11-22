import { NotificationChannelId } from "./AppNotifications";

//TimersStore
export const workKey = 'catadoro_app_timer_work';
export const shortBreakKey = 'catadoro_app_timer_short_break';
export const longBreakKey = 'catadoro_app_timer_long_break';
export const defaultWorkTime = 10;
export const defaultShortBreakTime = 5;
export const defaultLongBreakTime = 15;
//OtherSettingsStore
export const keepScreenOnKey = 'catadoro_keep_screen_on';
export const sessionsPerCycleKey = 'catadoro_sessions_per_cycle';
export const defaultSessionsPerCycle = 4;
export const catNameKey = 'catadoro_cat_name';
//AppStateStore
export const cycleStateKey = 'catadoro_cycle_state';
//NotificationsStore
export const notificationChannelIdKey = 'catadoro_notification_sound_name';
export const defaultNotificationChannelId: NotificationChannelId = 'catadoro_notification_1';
