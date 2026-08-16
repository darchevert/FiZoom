import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { RANK_LABEL } from '../lib/deck';
import { useApp } from '../lib/state';
import { radius, spacing, theme } from '../lib/theme';

export default function End() {
  const { session, clearSession, startGame } = useApp();

  const tally = useMemo(() => {
    if (!session) return [];
    const counts = new Map<string, number>();
    for (const c of session.drawn) counts.set(c.rank, (counts.get(c.rank) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [session]);

  if (!session) {
    router.replace('/home');
    return null;
  }

  const onReplay = () => {
    startGame();
    router.replace('/game');
  };

  const onHome = () => {
    clearSession();
    router.replace('/home');
  };

  return (
    <Screen scroll>
      <View style={{ alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xl }}>
        <Text style={{ fontSize: 48 }}>🏁</Text>
        <Text style={{ color: theme.ink, fontSize: 26, fontWeight: '800' }}>Fin de partie</Text>
        <Text style={{ color: theme.inkSoft }}>{session.drawn.length} cartes piochées</Text>
      </View>

      <View
        style={{
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: radius.md,
          padding: spacing.lg,
          alignItems: 'center',
          marginBottom: spacing.xl,
        }}
      >
        <Text style={{ color: theme.gold, fontWeight: '800', fontSize: 14, letterSpacing: 1 }}>FI-ZOOM DÉCLENCHÉS</Text>
        <Text style={{ color: theme.ink, fontSize: 40, fontWeight: '800' }}>{session.fizoomCount}</Text>
      </View>

      <Text style={{ color: theme.gold, fontWeight: '700', marginBottom: spacing.sm, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>
        Répartition des cartes
      </Text>
      <View style={{ gap: spacing.xs, marginBottom: spacing.xl }}>
        {tally.map(([rank, count]) => (
          <View key={rank} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <Text style={{ color: theme.ink }}>{RANK_LABEL[rank as keyof typeof RANK_LABEL]}</Text>
            <Text style={{ color: theme.inkSoft, fontVariant: ['tabular-nums'] }}>× {count}</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: spacing.sm }}>
        <Button label="Rejouer avec les mêmes joueurs" onPress={onReplay} />
        <Button label="Retour à l’accueil" variant="secondary" onPress={onHome} />
      </View>
    </Screen>
  );
}
