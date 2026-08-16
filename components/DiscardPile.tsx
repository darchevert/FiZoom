import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { PlayingCard as CardData, RANK_LABEL, isRedSuit } from '../lib/deck';
import { pileOffset, pileRotation } from '../lib/cardMotion';
import { radius, theme } from '../lib/theme';

const PILE_WIDTH = 46;
const PILE_HEIGHT = 64;
const MAX_VISIBLE = 8;

export function DiscardPile({ cards }: { cards: CardData[] }) {
  const visible = cards.slice(-MAX_VISIBLE);

  return (
    <View style={styles.wrap}>
      <View style={styles.stack}>
        {visible.length === 0 ? (
          <View style={[styles.slot, styles.emptySlot]} />
        ) : (
          visible.map((card, i) => {
            const angle = pileRotation(card.id);
            const offset = pileOffset(card.id);
            const isTop = i === visible.length - 1;
            return (
              <PileCard
                key={card.id}
                card={card}
                angle={angle}
                offset={offset}
                animateIn={isTop}
                zIndex={i}
              />
            );
          })
        )}
      </View>
      <Text style={styles.label}>Défausse · {cards.length}</Text>
    </View>
  );
}

function PileCard({
  card,
  angle,
  offset,
  animateIn,
  zIndex,
}: {
  card: CardData;
  angle: number;
  offset: { x: number; y: number };
  animateIn: boolean;
  zIndex: number;
}) {
  const progress = useRef(new Animated.Value(animateIn ? 0 : 1)).current;

  useEffect(() => {
    if (!animateIn) return;
    Animated.spring(progress, { toValue: 1, useNativeDriver: true, friction: 6, tension: 80 }).start();
  }, [card.id]);

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  const opacity = progress;

  return (
    <Animated.View
      style={[
        styles.slot,
        {
          zIndex,
          opacity,
          transform: [
            { translateX: offset.x },
            { translateY: offset.y },
            { rotate: `${angle}deg` },
            { scale },
          ],
        },
      ]}
    >
      <MiniCardFace card={card} />
    </Animated.View>
  );
}

function MiniCardFace({ card }: { card: CardData }) {
  const red = isRedSuit(card.suit);
  return (
    <View style={styles.miniCard}>
      <Text style={[styles.miniRank, red ? styles.red : styles.black]}>{RANK_LABEL[card.rank]}</Text>
      <Text style={[styles.miniSuit, red ? styles.red : styles.black]}>{card.suit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 6,
  },
  stack: {
    width: PILE_WIDTH + 16,
    height: PILE_HEIGHT + 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    position: 'absolute',
  },
  emptySlot: {
    width: PILE_WIDTH,
    height: PILE_HEIGHT,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },
  miniCard: {
    width: PILE_WIDTH,
    height: PILE_HEIGHT,
    borderRadius: radius.sm,
    backgroundColor: '#fdfaf3',
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  miniRank: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
  miniSuit: {
    fontSize: 16,
    lineHeight: 18,
  },
  label: {
    color: theme.inkSoft,
    fontSize: 11,
    fontVariant: ['tabular-nums'],
  },
  red: { color: '#a6192e' },
  black: { color: '#201810' },
});
