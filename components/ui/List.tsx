import React from 'react';
import { Pressable, View } from 'react-native';
import AppText from './AppText';
import Icon, { IconName } from './Icon';
import { useTheme } from '../../theme/useTheme';
import { TileTone } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

// Settings list building blocks (UI-06.2): SectionHeader, ListGroup (card) and ListRow.

export const SectionHeader = ({ title }: { title: string }) => {
  const { spacing } = useTheme();
  return (
    <AppText
      variant="label"
      tone="muted"
      accessibilityRole="header"
      style={{
        fontFamily: fonts.bodyExtraBold,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: spacing.xl,
        marginBottom: spacing.s,
        marginLeft: spacing.s,
      }}
    >
      {title}
    </AppText>
  );
};

// White rounded card; rows inside are separated by hairlines.
export const ListGroup = ({ children }: { children: React.ReactNode }) => {
  const { colors, radius, elevation } = useTheme();
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={[{ backgroundColor: colors.surface, borderRadius: radius.xl }, elevation.card]}>
      {rows.map((row, index) => (
        <View
          key={index}
          style={index > 0 ? { borderTopWidth: 1, borderTopColor: colors.line } : undefined}
        >
          {row}
        </View>
      ))}
    </View>
  );
};

type ListRowProps = {
  icon: IconName;
  tone?: TileTone;
  title: string;
  subtitle?: string;
  // Right side: stepper, toggle, value + chevron…
  trailing?: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export const ListRow = ({ icon, tone = 'focus', title, subtitle, trailing, onPress, accessibilityLabel, accessibilityHint }: ListRowProps) => {
  const { colors, spacing, radius, tileTones } = useTheme();
  const tile = tileTones[tone];

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 64, paddingVertical: spacing.s, paddingHorizontal: spacing.m }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.m,
          backgroundColor: tile.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={20} color={tile.icon} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.m, marginRight: spacing.xs }}>
        <AppText variant="bodyStrong" style={{ fontFamily: fonts.bodyBold, fontSize: 16 }}>{title}</AppText>
        {subtitle !== undefined && <AppText variant="caption" tone="muted">{subtitle}</AppText>}
      </View>
      {trailing}
    </View>
  );

  if (!onPress) {
    return content;
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      android_ripple={{ color: colors.line }}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      {content}
    </Pressable>
  );
};

// Value text followed by a chevron, for rows that open something.
export const ListValue = ({ value }: { value: string }) => {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <AppText variant="body" tone="muted" style={{ marginRight: spacing.xs }}>{value}</AppText>
      <Icon name="chevron" size={20} color={colors.textMuted} />
    </View>
  );
};
