import { router } from 'expo-router';
import React from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { useApp } from '../lib/state';
import { radius, spacing, theme } from '../lib/theme';

export default function Settings() {
  const { settings, toggleSound, toggleSoftMode } = useApp();

  return (
    <Screen scroll>
      <Text style={{ color: theme.ink, fontSize: 26, fontWeight: '800', marginBottom: spacing.lg }}>Paramètres</Text>

      <SettingRow
        title="Mode soft"
        description="Remplace les gorgées d’alcool par des gages sans alcool (pompes, mimes, défis…)."
        value={settings.softMode}
        onValueChange={toggleSoftMode}
      />

      <SettingRow
        title="Son"
        description="Petits sons de pioche et de Fi-Zoom pendant la partie."
        value={settings.soundOn}
        onValueChange={toggleSound}
      />

      <View
        style={{
          backgroundColor: theme.warnBg,
          borderWidth: 1,
          borderColor: theme.warnBorder,
          borderRadius: radius.md,
          padding: spacing.md,
          marginTop: spacing.xl,
        }}
      >
        <Text style={{ color: theme.warnInk, fontWeight: '700', marginBottom: 4 }}>Bois de l’eau régulièrement</Text>
        <Text style={{ color: theme.warnInk, fontSize: 13 }}>
          FiZoom est un jeu à jouer avec modération. Alterne avec de l’eau, ne prends jamais le volant après avoir bu et
          respecte la loi de ton pays sur la consommation d’alcool.
        </Text>
      </View>

      <Pressable onPress={() => router.push('/legal')} style={{ marginTop: spacing.xl }}>
        <Text style={{ color: theme.gold, fontWeight: '700' }}>Mentions légales &amp; confidentialité →</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={{ marginTop: spacing.lg, alignSelf: 'center' }}>
        <Text style={{ color: theme.inkSoft, fontWeight: '600' }}>← Retour</Text>
      </Pressable>
    </Screen>
  );
}

function SettingRow({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: radius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        gap: spacing.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.ink, fontWeight: '700', fontSize: 16, marginBottom: 2 }}>{title}</Text>
        <Text style={{ color: theme.inkSoft, fontSize: 13 }}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: theme.felt, false: theme.border }} thumbColor={theme.ink} />
    </View>
  );
}
