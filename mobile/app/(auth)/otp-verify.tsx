import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShieldCheck, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../../src/constants/theme';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { authApi } from '../../src/api/auth.api';
import { useAuthStore } from '../../src/store/auth.store';

export default function OtpVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phone = (params.phone as string) || '+91 9962786367';
  const { setAuth } = useAuthStore();
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(phone, otp);
      setAuth(res.user, res.token);
      router.replace('/(tabs)' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <ShieldCheck size={44} color={COLORS.accent} />
      </View>

      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subtitle}>
        We sent a 6-digit OTP code to <Text style={styles.phoneHighlight}>{phone}</Text>
      </Text>

      <Input
        value={otp}
        onChangeText={setOtp}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        style={styles.otpInput}
        containerStyle={{ marginVertical: SPACING.xl }}
      />

      <Button
        title="Verify & Enter Platform"
        onPress={handleVerify}
        loading={loading}
        size="lg"
        variant="primary"
        icon={<ArrowRight size={18} color="#FFF" />}
      />

      <TouchableOpacity style={styles.resendBtn} onPress={() => authApi.sendOtp(phone)}>
        <Text style={styles.resendText}>Didn't receive code? Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    padding: SPACING.xxl,
    justifyContent: 'center',
  },
  iconBox: {
    alignSelf: 'center',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  phoneHighlight: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 8,
  },
  resendBtn: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  resendText: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
});
