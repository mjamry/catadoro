// Pomodoro cycle rules (#76). Pure functions so they can be unit tested without React Native.
//
// A cycle is N focus sessions (default 4): focus -> short break -> ... -> focus N -> long break.
// `completedFocus` counts finished focus sessions in the current cycle (0..N).

export type Phase = 'work' | 'shortBreak' | 'longBreak';

export type CycleState = {
  completedFocus: number;
  sessionsPerCycle: number;
  // Local calendar day (YYYY-MM-DD) the cycle belongs to; a new day starts a fresh cycle.
  cycleDate: string;
};

export const DefaultSessionsPerCycle = 4;

export const dayKey = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const isBreak = (phase: Phase | 'idle' | undefined): boolean =>
  phase === 'shortBreak' || phase === 'longBreak';

// Called when a phase ends normally. Returns the updated cycle and the phase that comes next.
export const completePhase = (cycle: CycleState, finished: Phase): { cycle: CycleState; next: Phase } => {
  if (finished === 'work') {
    const completedFocus = Math.min(cycle.completedFocus + 1, cycle.sessionsPerCycle);
    const next: Phase = completedFocus >= cycle.sessionsPerCycle ? 'longBreak' : 'shortBreak';
    return { cycle: { ...cycle, completedFocus }, next };
  }
  if (finished === 'longBreak') {
    return { cycle: { ...cycle, completedFocus: 0 }, next: 'work' };
  }
  return { cycle, next: 'work' };
};

// A new calendar day starts at session 1 (only applied while nothing is running).
export const resetIfNewDay = (cycle: CycleState, now: Date): { cycle: CycleState; reset: boolean } => {
  const today = dayKey(now);
  if (cycle.cycleDate === today) {
    return { cycle, reset: false };
  }
  return { cycle: { ...cycle, completedFocus: 0, cycleDate: today }, reset: true };
};

// Focus number shown to the user ("Focus · 2 of 4"): the running/upcoming focus, or the one
// just finished while on a break.
export const focusNumber = (cycle: CycleState, phase: Phase | 'idle' | undefined, next: Phase): number => {
  if (isBreak(phase)) {
    return Math.max(cycle.completedFocus, 1);
  }
  if (phase === 'idle' && isBreak(next)) {
    return Math.max(cycle.completedFocus, 1);
  }
  return Math.min(cycle.completedFocus + 1, cycle.sessionsPerCycle);
};
