import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { RANKS, RANK_LABEL } from '../lib/deck';
import { useApp } from '../lib/state';
import { radius, spacing, theme } from '../lib/theme';

export default function Editor() {
  const { decks, addDeck, updateDeckRule, renameDeck, deleteDeck } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingDeck = decks.find((d) => d.id === editingId) ?? null;

  if (editingDeck) {
    return (
      <Screen scroll>
        <Pressable onPress={() => setEditingId(null)} style={{ marginBottom: spacing.md }}>
          <Text style={{ color: theme.gold, fontWeight: '700' }}>← Retour aux decks</Text>
        </Pressable>

        <TextInput
          value={editingDeck.name}
          onChangeText={(v) => renameDeck(editingDeck.id, v)}
          editable={editingDeck.editable}
          style={{
            color: theme.ink,
            fontSize: 24,
            fontWeight: '800',
            marginBottom: spacing.lg,
            borderBottomWidth: editingDeck.editable ? 1 : 0,
            borderBottomColor: theme.border,
            paddingVertical: 4,
          }}
        />

        {!editingDeck.editable && (
          <Text style={{ color: theme.inkSoft, marginBottom: spacing.md, fontSize: 13 }}>
            Le deck Classique n’est pas modifiable. Crée un deck personnalisé pour éditer les gages.
          </Text>
        )}

        <View style={{ gap: spacing.md }}>
          {RANKS.map((rank) => {
            const rule = editingDeck.rules[rank];
            return (
              <View
                key={rank}
                style={{
                  backgroundColor: theme.surface,
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: radius.md,
                  padding: spacing.md,
                  gap: spacing.sm,
                }}
              >
                <Text style={{ color: theme.gold, fontWeight: '800', fontSize: 15 }}>{RANK_LABEL[rank]}</Text>
                <RuleField
                  label="Normal"
                  value={rule.normal}
                  editable={editingDeck.editable}
                  onChangeText={(v) => updateDeckRule(editingDeck.id, rank, v, rule.soft)}
                />
                <RuleField
                  label="Mode soft"
                  value={rule.soft}
                  editable={editingDeck.editable}
                  onChangeText={(v) => updateDeckRule(editingDeck.id, rank, rule.normal, v)}
                />
              </View>
            );
          })}
        </View>

        {editingDeck.editable && (
          <Button
            label="Supprimer ce deck"
            variant="danger"
            onPress={() => {
              deleteDeck(editingDeck.id);
              setEditingId(null);
            }}
            style={{ marginTop: spacing.xl }}
          />
        )}
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Text style={{ color: theme.ink, fontSize: 26, fontWeight: '800', marginBottom: spacing.xs }}>Éditeur de règles</Text>
      <Text style={{ color: theme.inkSoft, marginBottom: spacing.lg }}>
        Personnalise les gages associés à chaque carte, sauvegardés sur cet appareil.
      </Text>

      <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
        {decks.map((deck) => (
          <Pressable
            key={deck.id}
            onPress={() => setEditingId(deck.id)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: radius.md,
              padding: spacing.md,
            }}
          >
            <Text style={{ color: theme.ink, fontSize: 16, fontWeight: '600' }}>{deck.name}</Text>
            <Text style={{ color: theme.inkSoft }}>{deck.editable ? 'Modifiable →' : 'Lecture seule →'}</Text>
          </Pressable>
        ))}
      </View>

      <Button
        label="Créer un deck personnalisé"
        variant="secondary"
        onPress={() => {
          const base = decks[0].rules;
          const id = addDeck(`Deck ${decks.length}`, base);
          setEditingId(id);
        }}
      />

      <Pressable onPress={() => router.back()} style={{ marginTop: spacing.lg, alignSelf: 'center' }}>
        <Text style={{ color: theme.gold, fontWeight: '700' }}>← Retour</Text>
      </Pressable>
    </Screen>
  );
}

function RuleField({
  label,
  value,
  editable,
  onChangeText,
}: {
  label: string;
  value: string;
  editable: boolean;
  onChangeText: (v: string) => void;
}) {
  return (
    <View>
      <Text style={{ color: theme.inkSoft, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline
        style={{
          color: theme.ink,
          fontSize: 15,
          backgroundColor: editable ? theme.surfaceRaised : 'transparent',
          borderRadius: radius.sm,
          padding: editable ? spacing.sm : 0,
        }}
      />
    </View>
  );
}
