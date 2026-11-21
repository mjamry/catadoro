// Run with: yarn test   (node --experimental-strip-types --test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCatLine, getMood, moodFace } from '../mood.ts';

const focus = { phase: 'work', nextPhase: 'shortBreak', isPaused: false, progress: 0, completedFocus: 0 };

test('focus: content, then bored, then fed up', () => {
  assert.equal(getMood({ ...focus, progress: 0.1 }), 'content');
  assert.equal(getMood({ ...focus, progress: 0.5 }), 'bored');
  assert.equal(getMood({ ...focus, progress: 0.9 }), 'fedUp');
  assert.equal(moodFace.content, 'normal');
  assert.equal(moodFace.bored, 'sad');
  assert.equal(moodFace.fedUp, 'angry');
});

test('pausing a focus does not calm the cat down', () => {
  assert.equal(getMood({ ...focus, isPaused: true, progress: 0.9 }), 'fedUp');
  assert.equal(getCatLine({ ...focus, isPaused: true, progress: 0.5 }).line, 'Still waiting here…');
});

test('focus ended, break not started: the cat asks to play', () => {
  const mood = getMood({ ...focus, phase: 'idle', nextPhase: 'shortBreak', completedFocus: 1 });
  assert.equal(mood, 'waiting');
  assert.equal(moodFace[mood], 'angry');
});

test('break: happy, paused break: sad', () => {
  const brk = { ...focus, phase: 'shortBreak', nextPhase: 'work' };
  assert.equal(moodFace[getMood(brk)], 'happy');
  assert.equal(moodFace[getMood({ ...brk, isPaused: true })], 'sad');
  assert.equal(getMood({ ...brk, phase: 'longBreak' }), 'playing');
});

test('idle before the first focus naps, after a break is satisfied', () => {
  assert.equal(getMood({ ...focus, phase: 'idle', nextPhase: 'work' }), 'napping');
  assert.equal(getMood({ ...focus, phase: undefined, nextPhase: 'work' }), 'napping');
  assert.equal(getMood({ ...focus, phase: 'idle', nextPhase: 'work', completedFocus: 2 }), 'satisfied');
});

test('the line is signed with the trimmed cat name when set', () => {
  assert.deepEqual(getCatLine({ ...focus, progress: 0.5 }, '  Mochi '), { name: 'Mochi', line: "I'm bored…" });
  assert.deepEqual(getCatLine({ ...focus, progress: 0.5 }, '   '), { line: "I'm bored…" });
  assert.equal(getCatLine(focus, 'x'.repeat(40)).name.length, 20);
});
