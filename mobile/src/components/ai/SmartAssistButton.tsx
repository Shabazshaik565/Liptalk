import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface SmartAssistButtonProps {
  title?: string;
  loading?: boolean;
  onPress: () => void;
  variant?: 'purple' | 'emerald';
}

export function SmartAssistButton({
  title = 'Auto-Draft with AI',
  loading = false,
  onPress,
  variant = 'purple',
}: SmartAssistButtonProps) {
  const isEmerald = variant === 'emerald';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isEmerald ? styles.emeraldBg : styles.purpleBg,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <>
          <Sparkles size={13} color="#FFF" />
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginVertical: SPACING.xs,
  },
  purpleBg: {
    backgroundColor: COLORS.primary,
  },
  emeraldBg: {
    backgroundColor: COLORS.accent,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
