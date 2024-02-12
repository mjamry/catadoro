import { AppState } from "./state/AppState";

type NotificationDto = {
  title: string;
  body: string;
  data?: object;
}

const backToWorkMessages = [
  "Time to swap the snack for a spreadsheet!",
  "Break's over, back to the grind!",
  "Hope you enjoyed your siesta, now it's time to Fiesta... with work!",
  "The break's over, the procrastination train has left the station!",
  "Enough procrastination, time for productivity!",
  "Your break's like a good TV show; it's over before you know it!",
  "Stretching is overrated; stretch your mind and get back to work!",
  "Back to reality - the break is officially terminated!",
  "That break was shorter than a Vine video; back to work!",
  "Break time's up, productivity party starts now!",
];

const playtimeMessages = [
  "After work's hustle, it's time for cat's bustle!",
  "Work's a wrap, now it's catnip tap!",
  "From deadlines to feline headlines, it's playtime!",
  "Cat's meow for play, forget the workday!",
  "From spreadsheets to cat feats, let's hit repeat!",
  "Work's a grind, now let's unwind with a feline!",
  "The job's a bore, but the cat's got more to explore!",
  "Done with the grind, it's cat cuddle time!",
  "No more work strife, just purrs for life!",
  "From tasks in a row to a cat's meow, let's go!",
];

type INotificationProvider = {
  provide: (type: AppState) => NotificationDto;
}

const useNotificationProvider = (): INotificationProvider => {
  const getRandomBackToWorkMessage = () => {
    const index = Math.floor((Math.random() * backToWorkMessages.length) + 1);
    return backToWorkMessages[index]
  }

  const getRandomPlaytimeMessage = () => {
    const index = Math.floor((Math.random() * playtimeMessages.length) + 1);
    return playtimeMessages[index]
  }

  const provide = (type: AppState) => {
    switch (type){
      case 'work':
        return {
          title: "Working END",
          body: getRandomPlaytimeMessage(),
        }
      case "shortBreak":
        return {
          title: "Short break end",
          body: getRandomBackToWorkMessage(),
        }
      case "longBreak":
        return {
          title: "Long break end",
          body: getRandomBackToWorkMessage(),
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