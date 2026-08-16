import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { useApp } from '../lib/state';
import { radius, spacing, theme } from '../lib/theme';

export default function Setup() {
  const { players, setPlayers, decks, selectedDeckId, selectDeck, startGame } = useApp();
  const [names, setNames] = useState<string[]>(players.length > 0 ? players : ['', '']);
  const [draft, setDraft] = useState('');

  const addPlayer = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setNames((prev) => [...prev.filter((n) => n.trim().length > 0), trimmed]);
    setDraft('');
  };

  const removePlayer = (index: number) => {
    setNames((prev) => prev.filter((_, i) => i !== index));
  };

  const validNames = names.filter((n) => n.trim().length > 0);
  const canStart = validNames.length >= 2;

  const onStart = () => {
    setPlayers(validNames);
    startGame();
    router.push('/game');
  };

  return (
    <Screen scroll>
      <Text style={{ color: theme.ink, fontSize: 26, fontWeight: '800', marginBottom: spacing.xs }}>Nouvelle partie</Text>
      <Text style={{ color: theme.inkSoft, marginBottom: spacing.lg }}>
        Un seul téléphone pour toute la table — chacun joue à son tour.
      </Text>

      <Text style={{ color: theme.gold, fontWeight: '700', marginBottom: spacing.sm, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>
        Joueurs ({validNames.length})
      </Text>

      <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
        {names.map((name, i) =>
          name.trim().length === 0 ? null : (
            <View
              key={`${name}-${i}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: radius.sm,
                paddingVertical: 10,
                paddingHorizontal: spacing.md,
              }}
            >
              <Text style={{ color: theme.ink, fontSize: 16 }}>{name}</Text>
              <Pressable onPress={() => removePlayer(i)} hitSlop={10}>
                <Text style={{ color: theme.warnBorder, fontWeight: '700' }}>Retirer</Text>
              </Pressable>
            </View>
          )
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={addPlayer}
          placeholder="Prénom du joueur"
          placeholderTextColor={theme.inkSoft}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            color: theme.ink,
            borderRadius: radius.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: 12,
          }}
        />
        <Button label="Ajouter" variant="secondary" onPress={addPlayer} style={{ paddingHorizontal: spacing.lg }} />
      </View>

      <Text style={{ color: theme.gold, fontWeight: '700', marginBottom: spacing.sm, textTransform: 'uppercase', fontSize: 12, letterSpacing: 1 }}>
        Deck de règles
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xl }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {decks.map((deck) => {
            const active = deck.id === selectedDeckId;
            return (
              <Pressable
                key={deck.id}
                onPress={() => selectDeck(deck.id)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: spacing.md,
                  borderRadius: radius.pill,
                  backgroundColor: active ? theme.accent : theme.surface,
                  borderWidth: 1,
                  borderColor: active ? theme.accent : theme.border,
                }}
              >
                <Text style={{ color: active ? theme.accentInk : theme.ink, fontWeight: '700' }}>{deck.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {!canStart && (
        <Text style={{ color: theme.inkSoft, fontSize: 13, marginBottom: spacing.md }}>
          Ajoute au moins 2 joueurs pour commencer.
        </Text>
      )}

      <Button label="Commencer la partie" onPress={onStart} disabled={!canStart} />
    </Screen>
  );
}
