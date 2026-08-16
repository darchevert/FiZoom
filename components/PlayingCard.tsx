import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { PlayingCard as CardData, RANK_LABEL, isRedSuit } from '../lib/deck';
import { radius, theme } from '../lib/theme';

export function PlayingCardFace({ card, size = 220 }: { card: CardData | null; size?: number }) {
  const flip = useSharedValue(0);

  useEffect(() => {
    flip.value = 0;
    flip.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) });
  }, [card?.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: flip.value < 0.5 ? 0 : 1,
    transform: [{ perspective: 800 }, { rotateY: `${90 - flip.value * 90}deg` }],
  }));

  if (!card) {
    return (
      <View style={[styles.card, styles.back, { width: size, height: size * 1.4 }]}>
        <Text style={styles.backGlyph}>♠♥{'\n'}♦♣</Text>
      </View>
    );
  }

  const red = isRedSuit(card.suit);

  return (
    <Animated.View style={[styles.card, { width: size, height: size * 1.4 }, animatedStyle]}>
      <Text style={[styles.corner, red ? styles.red : styles.black]}>{RANK_LABEL[card.rank]}</Text>
      <Text style={[styles.suitCenter, red ? styles.red : styles.black]}>{card.suit}</Text>
      <Text style={[styles.corner, styles.cornerBottom, red ? styles.red : styles.black]}>
        {RANK_LABEL[card.rank]}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fdfaf3',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  back: {
    backgroundColor: theme.felt,
    borderColor: theme.gold,
    borderWidth: 3,
  },
  backGlyph: {
    fontSize: 40,
    color: theme.gold,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 44,
  },
  corner: {
    position: 'absolute',
    top: 12,
    left: 14,
    fontSize: 22,
    fontWeight: '800',
  },
  cornerBottom: {
    top: undefined,
    bottom: 12,
    left: undefined,
    right: 14,
    transform: [{ rotate: '180deg' }],
  },
  suitCenter: {
    fontSize: 72,
  },
  red: { color: '#a6192e' },
  black: { color: '#201810' },
});
