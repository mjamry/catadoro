import React from 'react';
import { Pressable, View } from 'react-native';
import BottomSheet from '../ui/BottomSheet';
import AppText from '../ui/AppText';
import { useTheme } from '../../theme/useTheme';
import { fonts } from '../../theme/fonts';
import { ChannelIds, NotificationChannelId, useNotificationChannelIdStore } from '../../state/AppNotifications';
import { defaultNotificationChannelId } from '../../state/SettingsConsts';

// "Sound 1 … Sound 7", as decided for the redesign.
export const soundName = (channelId: NotificationChannelId) => `Sound ${ChannelIds.indexOf(channelId) + 1}`;

const Radio = ({ selected }: { selected: boolean }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: selected ? colors.accent : colors.textMuted,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {selected && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent }} />}
    </View>
  );
};

type SoundSheetProps = {
  visible: boolean;
  onClose: () => void;
};

// Alert sound picker (UI-07.2). The ▶ preview button comes with the sound preview feature (#84).
const SoundSheet = ({ visible, onClose }: SoundSheetProps) => {
  const { colors, radius, spacing } = useTheme();
  const selected = useNotificationChannelIdStore(s => s.notificationChannelId);
  const select = useNotificationChannelIdStore(s => s.setNotificationChannelId);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Alert sound" subtitle="Plays when a session ends.">
      <View accessibilityRole="radiogroup">
        {ChannelIds.map(channelId => {
          const isSelected = channelId === selected;
          return (
            <Pressable
              key={channelId}
              onPress={() => select(channelId)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={soundName(channelId)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: 52,
                paddingHorizontal: spacing.m,
                borderRadius: radius.l,
                backgroundColor: isSelected ? colors.accentSoft : pressed ? colors.surfaceMuted : 'transparent',
              })}
            >
              <Radio selected={isSelected} />
              <AppText style={{ marginLeft: spacing.m, fontFamily: fonts.bodyBold, fontSize: 17 }}>{soundName(channelId)}</AppText>
              {channelId === defaultNotificationChannelId && (
                <AppText variant="caption" tone="muted" style={{ marginLeft: spacing.s }}>Default</AppText>
              )}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
};

export default SoundSheet;
