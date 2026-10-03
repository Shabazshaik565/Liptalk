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
import { Mail, Lock, Phone, User as UserIcon, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../../src/constants/theme';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { authApi } from '../../src/api/auth.api';
import { useAuthStore } from '../../src/store/auth.store';
import { UserRole } from '../../src/types';

export default function RegisterScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('BUSINESS');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await authApi.register({
        email: email || 'user_' + Date.now() + '@example.com',
        phone: phone || undefined,
        role: selectedRole,
      });
      setAuth(res.user, res.token);
      router.replace('/(onboarding)/select-role' as any);
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.brandBox}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>Create Your Account</Text>
            <Text style={styles.brandTagline}>JOIN THE OPPORTUNITY NETWORK</Text>
            <Text style={styles.welcomeText}>
              Connect with partners, discover verified leads, and exchange services.
            </Text>
          </View>

          {/* User Role Pre-selector */}
          <Text style={styles.roleLabel}>I AM JOINING AS A:</Text>
          <View style={styles.roleRow}>
            {(['BUSINESS', 'INDIVIDUAL', 'PARTNER'] as UserRole[]).map((role) => (
              <TouchableOpacity
                key={role}
                style={[styles.roleCard, selectedRole === role && styles.roleCardActive]}
                onPress={() => setSelectedRole(role)}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleCardText, selectedRole === role && styles.roleCardTextActive]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Inputs */}
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="yourname@business.com"
            autoCapitalize="none"
            icon={<Mail size={18} color={COLORS.textDim} />}
          />

          <Input
            label="Phone Number (Optional)"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 9962786367"
            keyboardType="phone-pad"
            icon={<Phone size={18} color={COLORS.textDim} />}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            icon={<Lock size={18} color={COLORS.textDim} />}
          />

          {/* Submit */}
          <Button
            title="Continue to Onboarding"
            onPress={handleRegister}
            loading={loading}
            size="lg"
            variant="primary"
            icon={<ArrowRight size={18} color="#FFF" />}
            style={{ marginTop: SPACING.md }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={styles.loginLink}> Sign In</Text>
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
    marginBottom: SPACING.xl,
  },
  logoImage: {
    width: 170,
    height: 82,
    marginBottom: SPACING.sm,
  },
  brandName: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  brandTagline: {
    color: COLORS.primaryLight,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 4,
    marginBottom: SPACING.xs,
  },
  welcomeText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 300,
  },
  roleLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  roleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  roleCard: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  roleCardText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  roleCardTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  loginLink: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '800',
  },
});
