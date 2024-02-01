import { AppState } from "./state/AppState";

type NotificationDto = {
  title: string;
  body: string;
  data?: object;
}

type INotificationProvider = {
  provide: (type: AppState) => NotificationDto;
}

const useNotificationProvider = (): INotificationProvider => {
  const provide = (type: AppState) => {
    switch (type){
      case 'work':
        return {
          title: "Working END",
          body: 'Here is the notification body',
        }
      case "shortBreak":
        return {
          title: "Short break end",
          body: 'Here is the notification body',
        }
      case "longBreak":
        return {
          title: "Long break end",
          body: 'Here is the notification body',
        }
      case "idle":
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

export type { NotificationDto }
export default useNotificationProvider;