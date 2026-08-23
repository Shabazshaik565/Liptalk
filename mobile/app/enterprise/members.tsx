import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  UserPlus,
  Shield,
  Mail,
  CheckCircle2,
  MoreVertical,
  ChevronDown,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { enterpriseApi } from '../../src/api/domain.api';
import { OrganizationRole } from '../../src/types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function OrganizationMembersScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<OrganizationRole>('MEMBER');
  const [isInviting, setIsInviting] = useState(false);

  const { data: members, isLoading } = useQuery({
    queryKey: ['enterprise', 'members'],
    queryFn: () => enterpriseApi.getMembers('org_01'),
  });

  const handleSendInvite = async () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid corporate email address.');
      return;
    }

    setIsInviting(true);
    try {
      await enterpriseApi.inviteMember('org_01', inviteEmail.trim(), selectedRole);
      Alert.alert('Invitation Sent', `Invitation sent to ${inviteEmail} with ${selectedRole} permissions.`);
      setInviteEmail('');
      queryClient.invalidateQueries({ queryKey: ['enterprise', 'members'] });
    } catch {
      Alert.alert('Error', 'Failed to dispatch invitation.');
    } finally {
      setIsInviting(false);
    }
  };

  const roles: OrganizationRole[] = ['ADMIN', 'MANAGER', 'MEMBER', 'ANALYST'];

  return (
    <View style={styles.container}>
      <Header title="Team Members & Roles" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Invite Colleague Card */}
        <View style={styles.inviteCard}>
          <View style={styles.inviteHeader}>
            <UserPlus size={18} color={COLORS.primaryLight} />
            <Text style={styles.inviteTitle}>Invite Colleague to Workspace</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="colleague@company.com"
            placeholderTextColor={COLORS.textDim}
            value={inviteEmail}
            onChangeText={setInviteEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.rolePickerRow}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleChip,
                  selectedRole === r && styles.roleChipActive,
                ]}
                onPress={() => setSelectedRole(r)}
              >
                <Text
                  style={[
                    styles.roleChipText,
                    selectedRole === r && styles.roleChipTextActive,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Send Workspace Invitation"
            onPress={handleSendInvite}
            loading={isInviting}
            disabled={!inviteEmail.trim()}
            style={{ width: '100%', marginTop: SPACING.sm }}
          />
        </View>

        {/* Existing Members List */}
        <Text style={styles.sectionHeading}>ACTIVE MEMBERS ({members?.length || 2})</Text>

        {isLoading ? (
          <CardSkeleton />
        ) : (
          members?.map((m) => (
            <View key={m.id} style={styles.memberCard}>
              <Image
                source={{
                  uri:
                    m.user?.profile?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                }}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>
                    {m.user?.profile?.fullName || m.user?.email}
                  </Text>
                  <Badge
                    label={m.role}
                    variant={m.role === 'OWNER' ? 'primary' : m.role === 'ADMIN' ? 'accent' : 'neutral'}
                    size="sm"
                  />
                </View>
                <Text style={styles.memberRole}>{m.jobTitle} • {m.department}</Text>
                <Text style={styles.memberEmail}>{m.user?.email}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  inviteCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  inviteTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 13.5,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  rolePickerRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleChipActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderColor: COLORS.primary,
  },
  roleChipText: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '700',
  },
  roleChipTextActive: {
    color: COLORS.primaryLight,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberName: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  memberRole: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  memberEmail: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 2,
  },
});
