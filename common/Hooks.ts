import { useEnvironmentStore } from "../state/Environment";

const SecondsInMinute = 60;
export const useTimeInSeconds = (time: number) => {
  const buildType = useEnvironmentStore(s => s.buildType);
  if(buildType === 'DEV'){
    return time;
  }
  return time*SecondsInMinute;
};