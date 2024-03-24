import { create } from 'zustand';
import { DebugLogEntry } from '../common/DebugLogEntry';

type DebugState = {
  isDebugLogLevel: boolean;
  logs: DebugLogEntry[];
  setIsDev: (isDev: boolean) => void;
  addLog: (log: DebugLogEntry) => void;
  clear: () => void;
};

const useDebugStore = create<DebugState>(set => ({
  isDebugLogLevel: true,
  setIsDev: (isDev: boolean) => set(() => ({ isDebugLogLevel: isDev })),
  logs: [],
  addLog: (log: DebugLogEntry) =>
    set(state => ({ logs: [...state.logs, log] })),
  clear: () => set(() => ({ logs: [] })),
}));

export { useDebugStore };
