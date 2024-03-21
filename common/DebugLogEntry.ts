export type DebugLogLevel = 'I' | 'E' | 'W' | 'D';

export type DebugLogEntry = {
  level: DebugLogLevel;
  timestamp: string;
  prefix?: string;
  message: string;
  data?: any[];
};
