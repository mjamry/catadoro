import React from 'react';
import {
  Bug,
  ChartNoAxesColumn,
  ChevronLeft,
  Clock,
  Info,
  LucideIcon,
  Minus,
  Palette,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings,
  Share2,
  SkipForward,
  Square,
  SquareCheck,
  Volume2,
} from 'lucide-react-native';

// Plain line icon set (Lucide, ISC licence) replacing the old cat-ear icons.
const icons = {
  back: ChevronLeft,
  bug: Bug,
  checkbox: Square,
  checkbox_check: SquareCheck,
  clock: Clock,
  color: Palette,
  info: Info,
  minus: Minus,
  pause: Pause,
  play: Play,
  plus: Plus,
  reset: RotateCcw,
  settings: Settings,
  share: Share2,
  skip: SkipForward,
  sound: Volume2,
  stats: ChartNoAxesColumn,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

// Icons that read better filled (solid play/pause glyphs as in the mockups).
const filled: Partial<Record<IconName, boolean>> = { play: true, pause: true };

export const iconLabels: Record<IconName, string> = {
  back: 'Back',
  bug: 'Debug',
  checkbox: 'Not selected',
  checkbox_check: 'Selected',
  clock: 'Timer',
  color: 'Colours',
  info: 'About',
  minus: 'Decrease',
  pause: 'Pause',
  play: 'Start',
  plus: 'Increase',
  reset: 'Reset',
  settings: 'Settings',
  share: 'Share logs',
  skip: 'Skip',
  sound: 'Sound',
  stats: 'Statistics',
};

type IconProps = {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
};

const Icon = ({ name, size = 24, color, strokeWidth = 2.2 }: IconProps) => {
  const Component = icons[name];
  return (
    <Component
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      fill={filled[name] ? color : 'none'}
      absoluteStrokeWidth={false}
    />
  );
};

export default Icon;
