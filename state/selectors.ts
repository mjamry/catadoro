import { AppState, useAppStateStore } from './AppState';
import { useAppSettingsStore } from './AppSettings';
import { useTimersStore } from './AppTimers';
import { useTimeInSeconds } from '../common/Hooks';
import { Phase, completePhase, focusNumber } from '../common/cycle';

export type SessionInfo = {
  phase: AppState | undefined;
  // Phase that starts next: what Play starts when idle, or what follows the running phase.
  nextPhase: Phase;
  isPaused: boolean;
  completedFocus: number;
  sessionsPerCycle: number;
  // Focus number to show: the running/upcoming focus, or the one just finished during a break.
  focusNumber: number;
  // Length of the next phase in seconds (also what idle shows, e.g. 25:00).
  nextPhaseSeconds: number;
  // Countdown end as a timestamp, or undefined when nothing is running.
  endsAt: number | undefined;
};

// Everything the timer screen needs about where the user is in the cycle (#76).
export const useSessionInfo = (): SessionInfo => {
  const phase = useAppStateStore(s => s.currentState);
  const nextState = useAppStateStore(s => s.nextState);
  const isPaused = useAppStateStore(s => s.isPaused);
  const completedFocus = useAppStateStore(s => s.completedFocus);
  const cycleDate = useAppStateStore(s => s.cycleDate);
  const countdown = useAppStateStore(s => s.countdown);
  const sessionsPerCycle = useAppSettingsStore(s => s.sessionsPerCycle);

  const work = useTimeInSeconds(useTimersStore(s => s.work));
  const shortBreak = useTimeInSeconds(useTimersStore(s => s.shortBreak));
  const longBreak = useTimeInSeconds(useTimersStore(s => s.longBreak));
  const lengths: Record<string, number> = { work, shortBreak, longBreak };

  const cycle = { completedFocus, sessionsPerCycle, cycleDate };
  const inPhase = phase === 'work' || phase === 'shortBreak' || phase === 'longBreak';
  const nextPhase: Phase = inPhase ? completePhase(cycle, phase).next : (nextState === 'idle' ? 'work' : nextState);
  const running = inPhase && countdown > 0;

  return {
    phase,
    nextPhase,
    isPaused,
    completedFocus,
    sessionsPerCycle,
    focusNumber: focusNumber(cycle, phase, nextState === 'idle' ? 'work' : nextState),
    nextPhaseSeconds: lengths[nextPhase] ?? work,
    // While paused the end moves, so it is derived from the remaining countdown.
    endsAt: running ? Date.now() + countdown * 1000 : undefined,
  };
};

