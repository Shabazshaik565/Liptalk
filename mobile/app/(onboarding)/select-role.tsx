import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, User as UserIcon, Handshake, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { Button } from '../../src/components/common/Button';
import { UserRole } from '../../src/types';
import { useAuthStore } from '../../src/store/auth.store';

export default function SelectRoleScreen() {
  const router = useRouter();
  const { switchRole } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('BUSINESS');

  const roles = [
    {
      id: 'BUSINESS' as UserRole,
      title: 'Business & Agency',
      tagline: 'Scale products, acquire leads, hire vendors',
      desc: 'Create verified business entity, publish requirements, find service providers, and manage leads in CRM.',
      icon: Building2,
      color: COLORS.primary,
    },
    {
      id: 'INDIVIDUAL' as UserRole,
      title: 'Professional / Freelancer',
      tagline: 'Monetize skills & find opportunities',
      desc: 'Define skills and services you offer, respond to open requirements, and connect with growing businesses.',
      icon: UserIcon,
      color: COLORS.primaryLight,
    },
    {
      id: 'PARTNER' as UserRole,
      title: 'Corporate / Ecosystem Partner',
      tagline: 'Publish corporate offers & perks',
      desc: 'Offer enterprise services, logistics, tooling discounts, and reach verified businesses in the ecosystem.',
      icon: Handshake,
      color: COLORS.accent,
    },
  ];

  const handleContinue = () => {
    switchRole(selectedRole);
    router.push({
      pathname: '/(onboarding)/profile-setup',
      params: { role: selectedRole },
    } as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 1 OF 3</Text>
        <Text style={styles.title}>What Best Describes You?</Text>
        <Text style={styles.subtitle}>
          Lip Talk customizes your opportunity matching engine and tools based on your entity type.
        </Text>
      </View>

      <View style={styles.rolesList}>
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.id;
          return (
            <TouchableOpacity
              key={r.id}
              style={[
                styles.roleCard,
                isSelected && { borderColor: r.color, backgroundColor: COLORS.bgCardHover },
              ]}
              onPress={() => setSelectedRole(r.id)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <View style={[styles.iconContainer, { backgroundColor: `${r.color}25` }]}>
                  <Icon size={22} color={r.color} />
                </View>
                {isSelected && <CheckCircle2 size={20} color={r.color} />}
              </View>

              <Text style={styles.roleTitle}>{r.title}</Text>
              <Text style={[styles.roleTagline, { color: r.color }]}>{r.tagline}</Text>
              <Text style={styles.roleDesc}>{r.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        title="Continue to Profile Setup"
        onPress={handleContinue}
        size="lg"
        variant="primary"
        icon={<ArrowRight size={18} color="#FFF" />}
        style={{ marginTop: SPACING.lg, marginBottom: SPACING.xxl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
  },
  stepBadge: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
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
    lineHeight: 18,
  },
  rolesList: {
    gap: SPACING.md,
  },
  roleCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  roleTagline: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  roleDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
});
