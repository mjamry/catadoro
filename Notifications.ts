type NotificationType = 'workEnd' | 'shortBreakEnd' | 'longBreakEnd' | 'other';

type NotificationDto = {
  title: string;
  body: string;
  data?: object;
}

type INotificationProvider = {
  provide: (type: NotificationType) => NotificationDto;
}

const useNotificationProvider = (): INotificationProvider => {
  const provide = (type: NotificationType) => {
    switch (type){
      case 'workEnd':
        return {
          title: "Working END",
          body: 'Here is the notification body',
        }
      case "shortBreakEnd":
        return {
          title: "Short break end",
          body: 'Here is the notification body',
        }
      case "longBreakEnd":
        return {
          title: "Long break end",
          body: 'Here is the notification body',
        }
      case "other":
      default:
        return {
          title: "Other",
          body: 'Here is the notification body',
        }
    }
  }

  return {
    provide,
  }
}

export type { NotificationType, NotificationDto }
export default useNotificationProvider;