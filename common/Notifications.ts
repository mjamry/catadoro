import { AppState } from "../state/AppState";
import { useAppSettingsStore } from "../state/AppSettings";
import { cleanCatName } from "./mood";

type NotificationDto = {
  title: string;
  body: string;
  data?: object;
}

// The cat speaks in first person (#98): after a focus it wants to play, after a break it goes to nap.
const playtimeMessages = [
  "Time's up! Put the work down and play with me.",
  "I've waited long enough. Toy. Now.",
  "Break time! I'm by the door, bring the string.",
  "You've stared at that screen long enough. Look at me instead.",
  "Meow. That means break. Come play.",
  "Stretch with me, then chase the laser. Deal?",
];

const backToWorkMessages = [
  "That was fun. Go on, I'll nap.",
  "Okay, okay, back to work. Wake me up later.",
  "I'm tired now. Your turn to work.",
  "Good play. I'll be on the keyboard if you need me.",
  "Back to work, human. I'll be judging from the sofa.",
];

const pick = (messages: string[]) => messages[Math.floor(Math.random() * messages.length)];

type INotificationProvider = {
  provide: (type: AppState) => NotificationDto;
}

const useNotificationProvider = (): INotificationProvider => {
  const catName = useAppSettingsStore(s => s.catName);

  const provide = (type: AppState): NotificationDto => {
    const name = cleanCatName(catName);
    switch (type) {
      case 'work':
        return {
          title: name ? `${name} wants to play` : 'Your cat wants to play',
          body: pick(playtimeMessages),
        };
      case 'shortBreak':
      case 'longBreak':
        return {
          title: name ? `${name} is done playing` : 'Play time is over',
          body: pick(backToWorkMessages),
        };
      case 'idle':
      default:
        return {
          title: 'It looks like there were some errors',
          body: '',
        };
    }
  }

  return {
    provide,
  }
}

export type { NotificationDto }
export default useNotificationProvider;
