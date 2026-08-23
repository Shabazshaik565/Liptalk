import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Building, MapPin, Globe, Sparkles, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../../src/constants/theme';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { UserRole } from '../../src/types';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = (params.role as UserRole) || 'BUSINESS';

  // Form States
  const [name, setName] = useState('Nexas Digital Solutions');
  const [category, setCategory] = useState('IT & Software Development');
  const [headline, setHeadline] = useState('Enterprise Mobile & Full-Stack Cloud Studio');
  const [city, setCity] = useState('Bangalore');
  const [website, setWebsite] = useState('https://nexasdigital.io');
  const [bio, setBio] = useState('Building robust B2B systems and mobile apps.');

  const handleContinue = () => {
    router.push({
      pathname: '/(onboarding)/needs-offers-setup',
      params: { role, name, city },
    } as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 2 OF 3</Text>
        <Text style={styles.title}>
          {role === 'BUSINESS'
            ? 'Business Information'
            : role === 'PARTNER'
            ? 'Partner Details'
            : 'Personal Profile'}
        </Text>
        <Text style={styles.subtitle}>
          This information will be displayed to potential partners and clients.
        </Text>
      </View>

      <Input
        label={role === 'BUSINESS' ? 'Business Name' : role === 'PARTNER' ? 'Organization Name' : 'Full Name'}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        icon={<Building size={18} color={COLORS.textDim} />}
      />

      <Input
        label="Primary Category"
        value={category}
        onChangeText={setCategory}
        placeholder="e.g. IT & Software, Marketing, Legal"
        icon={<Sparkles size={18} color={COLORS.textDim} />}
      />

      <Input
        label="Headline / Tagline"
        value={headline}
        onChangeText={setHeadline}
        placeholder="Brief one-line summary of what you do"
      />

      <Input
        label="City & Region"
        value={city}
        onChangeText={setCity}
        placeholder="Bangalore, Mumbai, Delhi..."
        icon={<MapPin size={18} color={COLORS.textDim} />}
      />

      <Input
        label="Website or Portfolio Link"
        value={website}
        onChangeText={setWebsite}
        placeholder="https://..."
        autoCapitalize="none"
        icon={<Globe size={18} color={COLORS.textDim} />}
      />

      <Input
        label="About & Description"
        value={bio}
        onChangeText={setBio}
        placeholder="Tell potential connections more about your track record..."
        multiline
        numberOfLines={3}
        style={{ height: 80, textAlignVertical: 'top' }}
      />

      <Button
        title="Continue to Needs & Offers"
        onPress={handleContinue}
        size="lg"
        variant="primary"
        icon={<ArrowRight size={18} color="#FFF" />}
        style={{ marginTop: SPACING.md, marginBottom: SPACING.xxl }}
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
});
