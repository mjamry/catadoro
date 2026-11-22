// Run with: yarn test   (node --experimental-strip-types --test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { completePhase, dayKey, focusNumber, resetIfNewDay } from '../cycle.ts';

const start = { completedFocus: 0, sessionsPerCycle: 4, cycleDate: '2026-11-20' };

test('four focus sessions lead to a long break, then a new cycle', () => {
  let cycle = start;
  const phases = [];
  for (let i = 0; i < 4; i++) {
    const afterWork = completePhase(cycle, 'work');
    phases.push(afterWork.next);
    cycle = afterWork.cycle;
    if (afterWork.next === 'shortBreak') {
      const afterBreak = completePhase(cycle, 'shortBreak');
      assert.equal(afterBreak.next, 'work');
      cycle = afterBreak.cycle;
    }
  }
  assert.deepEqual(phases, ['shortBreak', 'shortBreak', 'shortBreak', 'longBreak']);
  assert.equal(cycle.completedFocus, 4);

  const afterLong = completePhase(cycle, 'longBreak');
  assert.equal(afterLong.next, 'work');
  assert.equal(afterLong.cycle.completedFocus, 0);
});

test('sessions per cycle comes from settings', () => {
  const two = { ...start, sessionsPerCycle: 2 };
  const first = completePhase(two, 'work');
  assert.equal(first.next, 'shortBreak');
  const second = completePhase(first.cycle, 'work');
  assert.equal(second.next, 'longBreak');
});

test('a new day starts the cycle at session 1', () => {
  const midCycle = { ...start, completedFocus: 3 };
  const sameDay = resetIfNewDay(midCycle, new Date(2026, 10, 20, 23, 59));
  assert.equal(sameDay.reset, false);
  assert.equal(sameDay.cycle.completedFocus, 3);

  const nextDay = resetIfNewDay(midCycle, new Date(2026, 10, 21, 0, 1));
  assert.equal(nextDay.reset, true);
  assert.equal(nextDay.cycle.completedFocus, 0);
  assert.equal(nextDay.cycle.cycleDate, '2026-11-21');
});

test('focus number shown in the session chip', () => {
  assert.equal(focusNumber(start, 'idle', 'work'), 1);
  assert.equal(focusNumber(start, 'work', 'shortBreak'), 1);
  const oneDone = { ...start, completedFocus: 1 };
  assert.equal(focusNumber(oneDone, 'shortBreak', 'work'), 1);
  assert.equal(focusNumber(oneDone, 'idle', 'shortBreak'), 1);
  assert.equal(focusNumber(oneDone, 'idle', 'work'), 2);
  const allDone = { ...start, completedFocus: 4 };
  assert.equal(focusNumber(allDone, 'longBreak', 'work'), 4);
});

test('day key uses the local calendar date', () => {
  assert.equal(dayKey(new Date(2026, 0, 5, 8, 0)), '2026-01-05');
});
