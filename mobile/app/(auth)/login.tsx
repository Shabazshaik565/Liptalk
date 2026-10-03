import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Phone, ArrowRight, Sparkles } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { authApi } from '../../src/api/auth.api';
import { useAuthStore } from '../../src/store/auth.store';
import { CURRENT_USER } from '../../src/api/mockData';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('alex.morgan@nexastech.com');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+91 9962786367');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (authMode === 'password') {
        const res = await authApi.login(identifier, password);
        await setAuth(res.user, res.token);
        if (res.user.needsOnboarding) {
          router.replace('/(onboarding)/select-role' as any);
        } else {
          router.replace('/(tabs)' as any);
        }
      } else {
        await authApi.sendOtp(phone);
        router.push({
          pathname: '/(auth)/otp-verify',
          params: { phone },
        } as any);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await setAuth(CURRENT_USER, 'demo_token_alex_morgan');
      router.replace('/(tabs)' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Branding */}
          <View style={styles.brandBox}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandTagline}>CONNECT • PROMOTE • GROW</Text>
            <Text style={styles.welcomeText}>
              Sign in to match requirements, discover verified partners, and scale your business opportunities.
            </Text>
          </View>

          {/* Tab Selector */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, authMode === 'password' && styles.toggleBtnActive]}
              onPress={() => setAuthMode('password')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  authMode === 'password' && styles.toggleTextActive,
                ]}
              >
                Email & Password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, authMode === 'otp' && styles.toggleBtnActive]}
              onPress={() => setAuthMode('otp')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  authMode === 'otp' && styles.toggleTextActive,
                ]}
              >
                Phone OTP
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          {authMode === 'password' ? (
            <View>
              <Input
                label="Email or Username"
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="alex@nexastech.com"
                autoCapitalize="none"
                icon={<Mail size={18} color={COLORS.textDim} />}
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                icon={<Lock size={18} color={COLORS.textDim} />}
              />
            </View>
          ) : (
            <View>
              <Input
                label="Registered Mobile Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 9962786367"
                keyboardType="phone-pad"
                icon={<Phone size={18} color={COLORS.textDim} />}
                hint="We will send a 6-digit verification SMS code."
              />
            </View>
          )}

          {/* Action Button */}
          <Button
            title={authMode === 'password' ? 'Sign In to Lip Talk' : 'Send Verification OTP'}
            onPress={handleLogin}
            loading={loading}
            size="lg"
            variant="primary"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            style={{ marginTop: SPACING.md }}
          />

          <Button
            title="1-Tap Demo Sign In (Executive Pro)"
            onPress={handleDemoLogin}
            loading={loading}
            size="md"
            variant="glass"
            icon={<Sparkles size={16} color={COLORS.primaryLight} />}
            style={{ marginTop: SPACING.sm }}
          />

          {/* Footer Links */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have a Lip Talk account?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/register' as any)}
              activeOpacity={0.75}
            >
              <Text style={styles.registerLink}> Create Free Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoImage: {
    width: 200,
    height: 75,
    marginBottom: SPACING.xs,
  },
  brandTagline: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  welcomeText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 18,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  toggleText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  registerLink: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '800',
  },
});
