/* eslint-disable no-console */

import { Log } from './LoggerService';

const colors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  grey: 90,
};

const colorReset = '\x1b[0m';
const colorSelect = (color: number) => `\x1b[${color}m`;
const print = (msg: any) => {
  if (typeof msg === 'string') {
    return msg;
  }

  return msg.map((m: any) => `${JSON.stringify(m)} \n`);
};

const colorInfo = (msg: any) =>
  `${colorSelect(colors.green)}${print(msg)}${colorReset}`;
const colorDebug = (msg: any) =>
  `${colorSelect(colors.white)}${print(msg)}${colorReset}`;
const colorWarn = (msg: any) =>
  `${colorSelect(colors.yellow)}${print(msg)}${colorReset}`;
const colorError = (msg: any) =>
  `${colorSelect(colors.red)}${print(msg)}${colorReset}`;

const useConsoleLog = () => {
  const logContent = (logEntry: Log) => {
    const prefix = logEntry.prefix ? `[${logEntry.prefix}]` : '';
    return `[${logEntry.level}][${logEntry.timestamp}]${prefix} ${logEntry.message}`;
  };

  const error = (logEntry: Log) => {
    if (logEntry.data && logEntry.data.length > 0) {
      console.error(
        colorError(logContent(logEntry)),
        '\n',
        colorError(logEntry.data),
      );
    } else {
      console.error(colorError(logContent(logEntry)));
    }
  };

  const warning = (logEntry: Log) => {
    if (logEntry.data && logEntry.data.length > 0) {
      console.warn(
        colorWarn(logContent(logEntry)),
        '\n',
        colorWarn(logEntry.data),
      );
    } else {
      console.warn(colorWarn(logContent(logEntry)));
    }
  };

  const info = (logEntry: Log) => {
    if (logEntry.data && logEntry.data.length > 0) {
      console.info(
        colorInfo(logContent(logEntry)),
        '\n',
        colorInfo(logEntry.data),
      );
    } else {
      console.info(colorInfo(logContent(logEntry)));
    }
  };

  const debug = (logEntry: Log) => {
    if (logEntry.data && logEntry.data.length > 0) {
      console.debug(
        colorDebug(logContent(logEntry)),
        '\n',
        colorDebug(logEntry.data),
      );
    } else {
      console.debug(colorDebug(logContent(logEntry)));
    }
  };

  return {
    error,
    warning,
    info,
    debug,
  };
};

export default useConsoleLog;
