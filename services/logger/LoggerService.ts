import useConsoleLog from './ConsoleLog';
import useInAppLog from './InAppLog';
import { useDebugStore } from '../../state/DebugState';

type LogLevel = 'error' | 'warning' | 'info' | 'debug';

type Exception = {
  message: string;
  stack: string;
};

type ILoggerService = {
  error: (msg: string, ...error: any[]) => void;
  warning: (msg: string, ...data: any[]) => void;
  info: (msg: string, ...data: any[]) => void;
  debug: (msg: string, ...data: any[]) => void;
};

type Log = {
  userId: number;
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any[];
  prefix?: string;
};

const useLoggerService = (prefix: string): ILoggerService => {
  const loggers = [useConsoleLog(), useInAppLog()];
  const isDebugLogLevel = useDebugStore(state => state.isDebugLogLevel);
  const userID = 0;

  const getTimestamp = () => {
    const now = new Date();
    const pad = (value: number, length: number, char: string) => {
      return value.toString().padStart(length, char);
    };

    return `${pad(now.getHours(), 2, '0')}:${pad(
      now.getMinutes(),
      2,
      '0',
    )}:${pad(now.getSeconds(), 2, '0')}.${pad(now.getMilliseconds(), 3, '0')}`;
  };

  const generateLog = (
    level: LogLevel,
    message: string,
    ...data: any[]
  ): Log => {
    return {
      userId: userID,
      timestamp: getTimestamp(),
      level,
      message,
      data: data.length > 0 ? data : undefined,
      prefix,
    };
  };

  const error = (message: string, exception?: Exception) => {
    const logEntry = generateLog('error', message, exception);
    loggers.forEach(logger => {
      logger.error(logEntry);
    });
  };

  const warning = (message: string, ...data: any[]) => {
    const logEntry = generateLog('warning', message, data);

    loggers.forEach(logger => {
      logger.warning(logEntry);
    });
  };

  const info = (message: string, ...data: any[]) => {
    const logEntry = generateLog('info', message, data);

    loggers.forEach(logger => {
      logger.info(logEntry);
    });
  };

  const debug = (message: string, ...data: any[]) => {
    if (isDebugLogLevel) {
      const logEntry = generateLog('debug', message, data);

      loggers.forEach(logger => {
        logger.debug(logEntry);
      });
    }
  };

  return {
    error,
    warning,
    info,
    debug,
  };
};

export default useLoggerService;
export type { LogLevel, Log };
