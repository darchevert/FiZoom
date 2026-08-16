import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { CardTrackerModal } from '../components/CardTracker';
import { DiscardPile } from '../components/DiscardPile';
import { PlayingCardFace } from '../components/PlayingCard';
import { Screen } from '../components/Screen';
import { gageFor, triggersReplay } from '../lib/deck';
import { useApp } from '../lib/state';
import { spacing, theme } from '../lib/theme';

export default function Game() {
  const { session, activeDeck, settings, drawCard, nextTurn, clearSession } = useApp();
  const [trackerOpen, setTrackerOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace('/setup');
    }
  }, [session]);

  if (!session) return null;

  const currentPlayer = session.players[session.currentPlayerIndex];
  const replay = session.current ? triggersReplay(session.current) : false;
  const deckExhausted = session.deck.length === 0 && !session.revealed;

  const onDraw = () => drawCard();

  const onContinue = () => {
    if (session.deck.length === 0) {
      router.push('/end');
      return;
    }
    nextTurn();
  };

  const onQuit = () => {
    clearSession();
    router.replace('/home');
  };

  const pileCards = session.current ? session.drawn.slice(0, -1) : session.drawn;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={{ color: theme.inkSoft, fontSize: 13 }}>{activeDeck.name}</Text>
          <Text style={{ color: theme.inkSoft, fontSize: 13, fontVariant: ['tabular-nums'] }}>
            {session.deck.length} cartes restantes
          </Text>
          <Pressable onPress={() => setTrackerOpen(true)} hitSlop={8} style={{ marginTop: spacing.xs }}>
            <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700' }}>Cartes piochées →</Text>
          </Pressable>
        </View>
        <DiscardPile cards={pileCards} />
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
        <Text style={{ color: theme.gold, fontSize: 22, fontWeight: '800', textAlign: 'center' }}>
          Au tour de {currentPlayer}
        </Text>

        <PlayingCardFace card={session.current} />

        {session.current && session.revealed && (
          <View style={{ alignItems: 'center', gap: spacing.sm, maxWidth: 320 }}>
            {replay && (
              <Text style={{ color: theme.accent, fontWeight: '800', fontSize: 13, letterSpacing: 1 }}>FI-ZOOM</Text>
            )}
            <Text style={{ color: theme.ink, fontSize: 19, fontWeight: '700', textAlign: 'center' }}>
              {gageFor(activeDeck.rules, session.current, settings.softMode)}
            </Text>
          </View>
        )}

        {deckExhausted && (
          <Text style={{ color: theme.inkSoft, textAlign: 'center' }}>Le paquet est vide.</Text>
        )}
      </View>

      <View style={{ gap: spacing.sm }}>
        {!session.revealed ? (
          <Button label="Piocher une carte" onPress={onDraw} disabled={session.deck.length === 0 && session.drawn.length === 0} />
        ) : (
          <Button
            label={session.deck.length === 0 ? 'Voir le récap' : replay ? `${currentPlayer} rejoue` : 'Joueur suivant'}
            onPress={onContinue}
          />
        )}
        <Button label="Quitter la partie" variant="ghost" onPress={onQuit} />
      </View>

      <CardTrackerModal visible={trackerOpen} onClose={() => setTrackerOpen(false)} drawn={session.drawn} />
    </Screen>
  );
}
