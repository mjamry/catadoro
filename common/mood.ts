import type { FaceName } from '../components/mascot/mascotPaths';
import type { Phase } from './cycle';

// The cat's mood shows how long it has been ignored (#98):
// fine at the start of a focus, bored in the middle, fed up at the end, happy on a break.
export type Mood = 'napping' | 'content' | 'bored' | 'fedUp' | 'waiting' | 'playing' | 'playPaused' | 'satisfied';

export type MoodInput = {
  phase: 'idle' | Phase | undefined;
  nextPhase: Phase;
  isPaused: boolean;
  // Elapsed part of the running phase, 0..1.
  progress: number;
  completedFocus: number;
};

export const BoredFrom = 1 / 3;
export const FedUpFrom = 2 / 3;

export const getMood = ({ phase, nextPhase, isPaused, progress, completedFocus }: MoodInput): Mood => {
  if (phase === 'work') {
    // Pausing a focus is still not playing, so the mood keeps following the time spent.
    if (progress >= FedUpFrom) return 'fedUp';
    if (progress >= BoredFrom) return 'bored';
    return 'content';
  }
  if (phase === 'shortBreak' || phase === 'longBreak') {
    return isPaused ? 'playPaused' : 'playing';
  }
  // Idle: a focus just ended and the break has not started yet.
  if (nextPhase !== 'work') return 'waiting';
  // Idle after a break, or before the first focus.
  return completedFocus > 0 ? 'satisfied' : 'napping';
};

export const moodFace: Record<Mood, FaceName> = {
  napping: 'squint',
  content: 'normal',
  bored: 'sad',
  fedUp: 'angry',
  waiting: 'angry',
  playing: 'happy',
  playPaused: 'sad',
  satisfied: 'squint',
};

// What the cat says under the time (first person).
const lines: Record<Mood, string> = {
  napping: "Go on, I'll nap.",
  content: "I'm fine. Do your thing.",
  bored: "I'm bored…",
  fedUp: "That's it. Play with me!",
  waiting: "Time's up! Let's play!",
  playing: 'Put the phone down, play with me!',
  playPaused: 'Hey, we were playing…',
  satisfied: "That was fun. I'll nap now.",
};

const pausedFocusLine = 'Still waiting here…';

export type CatLine = { name?: string; line: string };

export const CatNameMaxLength = 20;
export const cleanCatName = (name: string | null | undefined): string => (name ?? '').trim().slice(0, CatNameMaxLength);

export const getCatLine = (input: MoodInput, catName?: string): CatLine => {
  const mood = getMood(input);
  const line = input.phase === 'work' && input.isPaused ? pausedFocusLine : lines[mood];
  const name = cleanCatName(catName);
  return name ? { name, line } : { line };
};
