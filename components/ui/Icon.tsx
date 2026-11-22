import React from 'react';
import {
  Bell,
  Bug,
  Cat,
  ChartNoAxesColumn,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Info,
  LucideIcon,
  Minus,
  Palette,
  Pause,
  Play,
  Plus,
  Repeat,
  RotateCcw,
  Settings,
  Share2,
  SkipForward,
  Sofa,
  Square,
  SquareCheck,
  Sun,
  Volume2,
} from 'lucide-react-native';

// Plain line icon set (Lucide, ISC licence) replacing the old cat-ear icons.
const icons = {
  back: ChevronLeft,
  bell: Bell,
  bug: Bug,
  cat: Cat,
  chevron: ChevronRight,
  checkbox: Square,
  checkbox_check: SquareCheck,
  clock: Clock,
  coffee: Coffee,
  color: Palette,
  info: Info,
  minus: Minus,
  pause: Pause,
  play: Play,
  plus: Plus,
  repeat: Repeat,
  reset: RotateCcw,
  settings: Settings,
  share: Share2,
  skip: SkipForward,
  sofa: Sofa,
  sound: Volume2,
  sun: Sun,
  stats: ChartNoAxesColumn,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

// Icons that read better filled (solid play/pause glyphs as in the mockups).
const filled: Partial<Record<IconName, boolean>> = { play: true, pause: true };

export const iconLabels: Record<IconName, string> = {
  back: 'Back',
  bell: 'Sound',
  bug: 'Debug',
  cat: 'Cat',
  chevron: 'Open',
  checkbox: 'Not selected',
  checkbox_check: 'Selected',
  clock: 'Timer',
  coffee: 'Short break',
  color: 'Colours',
  info: 'About',
  minus: 'Decrease',
  pause: 'Pause',
  play: 'Start',
  plus: 'Increase',
  repeat: 'Sessions',
  reset: 'Reset',
  settings: 'Settings',
  share: 'Share logs',
  skip: 'Skip',
  sofa: 'Long break',
  sound: 'Sound',
  sun: 'Screen',
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
