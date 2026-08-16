import React, { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PlayingCard as CardData, RANKS, RANK_LABEL, SUITS, isRedSuit } from '../lib/deck';
import { radius, spacing, theme } from '../lib/theme';

export function CardTrackerModal({
  visible,
  onClose,
  drawn,
}: {
  visible: boolean;
  onClose: () => void;
  drawn: CardData[];
}) {
  const drawnIds = useMemo(() => new Set(drawn.map((c) => c.id)), [drawn]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Cartes piochées</Text>
              <Text style={styles.subtitle}>{drawn.length} / 52 sorties du paquet</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>Fermer</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }}>
            {RANKS.map((rank) => (
              <View key={rank} style={styles.row}>
                <Text style={styles.rankLabel}>{RANK_LABEL[rank]}</Text>
                <View style={styles.suits}>
                  {SUITS.map((suit) => {
                    const id = `${rank}${suit}`;
                    const isDrawn = drawnIds.has(id);
                    const red = isRedSuit(suit);
                    return (
                      <View key={id} style={[styles.chip, isDrawn && styles.chipDrawn]}>
                        <Text style={[styles.chipGlyph, red ? styles.red : styles.black, isDrawn && styles.chipGlyphDrawn]}>
                          {suit}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.legendRow}>
            <View style={[styles.chip, { width: 16, height: 16 }]} />
            <Text style={styles.legendText}>Encore dans le paquet</Text>
            <View style={[styles.chip, styles.chipDrawn, { width: 16, height: 16, marginLeft: spacing.md }]} />
            <Text style={styles.legendText}>Déjà piochée</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.bg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: theme.border,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: { color: theme.ink, fontSize: 20, fontWeight: '800' },
  subtitle: { color: theme.inkSoft, fontSize: 12, marginTop: 2, fontVariant: ['tabular-nums'] },
  close: { color: theme.gold, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  rankLabel: {
    width: 56,
    color: theme.ink,
    fontWeight: '700',
    fontSize: 14,
  },
  suits: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipDrawn: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    opacity: 0.35,
  },
  chipGlyph: { fontSize: 20 },
  chipGlyphDrawn: { opacity: 0.6 },
  red: { color: '#e0788a' },
  black: { color: theme.ink },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  legendText: { color: theme.inkSoft, fontSize: 12, marginLeft: spacing.xs },
});
