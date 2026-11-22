import React from 'react';
import { View } from 'react-native';
import ControlButton from './ControlButton';

export const ExtendMinutes = 5;

type ControlBarProps = {
  phase: string | undefined;
  running: boolean;
  // +5 min is available right after a phase ends.
  canExtend: boolean;
  onPlay: () => void;
  onPause: () => void;
  onExtend: () => void;
};

// Secondary · primary · secondary (UI-04.5).
// Idle: Reset · Play · Skip (or +5 min right after a phase ends) · focus: Reset · Pause · +5 min · break: +5 min · Pause · Skip.
// Reset, Skip and +5 min while running stay disabled until the session controls land (#80).
const ControlBar = ({ phase, running, canExtend, onPlay, onPause, onExtend }: ControlBarProps) => {
  const isBreak = phase === 'shortBreak' || phase === 'longBreak';
  const extendLabel = `+${ExtendMinutes} min`;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
      {isBreak
        ? <ControlButton icon="plus" label={extendLabel} onPress={() => {}} disabled />
        : <ControlButton icon="reset" label="Reset" onPress={() => {}} disabled />}
      {running
        ? <ControlButton icon="pause" primary onPress={onPause} accessibilityLabel="Pause" />
        : <ControlButton icon="play" primary onPress={onPlay} accessibilityLabel="Start" />}
      {phase === 'work'
        ? <ControlButton icon="plus" label={extendLabel} onPress={() => {}} disabled />
        : canExtend
          ? <ControlButton icon="plus" label={extendLabel} onPress={onExtend} />
          : <ControlButton icon="skip" label="Skip" onPress={() => {}} disabled />}
    </View>
  );
};

export default ControlBar;
