import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { spacing, theme } from '../lib/theme';

export default function Home() {
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', marginTop: spacing.xl, gap: spacing.xs }}>
          <Text style={{ fontSize: 56 }}>🃏</Text>
          <Text style={{ color: theme.ink, fontSize: 34, fontWeight: '800', letterSpacing: 0.5 }}>FiZoom</Text>
          <Text style={{ color: theme.inkSoft, fontSize: 15 }}>Pioche. Gage. Fi-Zoom.</Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <Button label="Jouer" onPress={() => router.push('/setup')} />
          <Button label="Éditeur de règles" variant="secondary" onPress={() => router.push('/editor')} />
          <Button label="Paramètres" variant="secondary" onPress={() => router.push('/settings')} />
          <Button label="Mentions légales" variant="ghost" onPress={() => router.push('/legal')} />
        </View>
      </View>
    </Screen>
  );
}
