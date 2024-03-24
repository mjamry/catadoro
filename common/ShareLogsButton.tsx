
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useDebugStore } from '../state/DebugState';

const useUseShareLogs = () => {
  const logEntries = useDebugStore(state => state.logs);

  const getLogFileName = () => {
    const withZeros = (value: number, size = 2) => {
      return value.toString().padStart(size, '0');
    };

    const now = new Date();
    return `log_${now.getFullYear()}${withZeros(now.getMonth() + 1)}${withZeros(
      now.getDay(),
    )}_${withZeros(now.getHours())}${withZeros(now.getMinutes())}${withZeros(
      now.getSeconds(),
    )}.txt`;
  };

  const share = async (): Promise<void> => {
    try {
      const path = `${FileSystem.cacheDirectory}/${getLogFileName()}`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(logEntries), { encoding: 'utf8' });
      const fileUri = 'file://' + path;


      // const shareOptions = {
      //   social: Social.Email,
      //   message: 'Log file attached',
      //   subject: `[VanAutomation][Log] ${new Date().toISOString()}`,
      //   url: fileUri,
      //   type: 'text/plain',
      //   email: 'michal.jamry@gmail.com',
      //   appId: '',
      // };

      // const shareResult = await Share.open(shareOptions);
      await Sharing.shareAsync(fileUri);
      // log.info('Share result', shareResult);
    } catch (err: any) {
      console.error(`Log write error: ${err.message}`, err);
    }
  };

  return share;
};

export default useUseShareLogs;
