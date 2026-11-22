import { DebugLogLevel } from '../../common/DebugLogEntry';
import { useDebugStore } from '../../state/DebugState';
import { Log } from './LoggerService';

const useInAppLog = () => {
  const addLog = useDebugStore(state => state.addLog);
  const getLevelLetter = (lvl: string): DebugLogLevel => {
    switch (lvl) {
      case 'info':
        return 'I';
      case 'warn':
        return 'W';
      case 'error':
        return 'E';
      case 'debug':
      default:
        return 'D';
    }
  };

  const pushLog = (newEntry: Log) => {
    addLog({
      level: getLevelLetter(newEntry.level),
      message: newEntry.message,
      timestamp: newEntry.timestamp,
      prefix: newEntry.prefix,
      data: newEntry.data,
    });
  };

  const error = (logEntry: Log) => {
    pushLog(logEntry);
  };

  const warning = (logEntry: Log) => {
    pushLog(logEntry);
  };

  const info = (logEntry: Log) => {
    pushLog(logEntry);
  };

  const debug = (logEntry: Log) => {
    pushLog(logEntry);
  };

  return {
    error,
    warning,
    info,
    debug,
  };
};

export default useInAppLog;
