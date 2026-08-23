import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PresenceStatus } from '../../types';
import { COLORS } from '../../constants/theme';

interface PresenceIndicatorProps {
  status?: PresenceStatus | string;
  size?: number;
  showBorder?: boolean;
}

export function PresenceIndicator({
  status = 'OFFLINE',
  size = 10,
  showBorder = true,
}: PresenceIndicatorProps) {
  let color = COLORS.textDim;

  switch (status?.toUpperCase()) {
    case 'ONLINE':
      color = COLORS.accent; // #10B981 emerald
      break;
    case 'AWAY':
      color = COLORS.warning; // amber
      break;
    case 'BUSY':
      color = COLORS.danger; // red
      break;
    case 'IN_CALL':
      color = COLORS.primaryLight; // purple
      break;
    default:
      color = COLORS.textDim;
  }

  return (
    <View
      style={[
        styles.indicator,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        showBorder && styles.border,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  indicator: {},
  border: {
    borderWidth: 1.5,
    borderColor: COLORS.bgDark,
  },
});
