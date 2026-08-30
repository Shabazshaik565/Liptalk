import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

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
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 1200,
            useNativeDriver: false,
          }),
        ]),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }], alignSelf: 'flex-start' }}>
      <TouchableOpacity
        style={[
          styles.button,
          isEmerald ? styles.emeraldBg : styles.purpleBg,
          isEmerald ? SHADOWS.glowAccent : SHADOWS.glowPrimary,
        ]}
        onPress={onPress}
        disabled={loading}
        activeOpacity={0.82}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    marginVertical: SPACING.xs,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
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
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});
