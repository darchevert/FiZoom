import { router } from 'expo-router';
import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { spacing, theme } from '../lib/theme';

const PRIVACY_URL = 'https://darchevert.github.io/FiZoom/privacy.html';

export default function Legal() {
  return (
    <Screen scroll>
      <Text style={{ color: theme.ink, fontSize: 26, fontWeight: '800', marginBottom: spacing.lg }}>Mentions légales</Text>

      <Section title="Contenu 18+">
        FiZoom est un jeu à boire destiné exclusivement aux personnes majeures. L’application incite à une consommation
        responsable et n’encourage jamais l’ivresse ou la consommation excessive.
      </Section>

      <Section title="Aucune donnée envoyée">
        FiZoom fonctionne entièrement hors-ligne. Les prénoms des joueurs et les decks de règles personnalisés sont
        stockés uniquement sur cet appareil et ne sont jamais transmis à un serveur.
      </Section>

      <Section title="Pas un jeu d’argent">
        Aucune mise, aucun gain réel : FiZoom est un jeu à boire, pas un jeu de hasard ou d’argent.
      </Section>

      <Section title="Éditeur">
        Application développée de façon indépendante. Contact : cedric.suslec@gmail.com
      </Section>

      <Pressable onPress={() => Linking.openURL(PRIVACY_URL)} style={{ marginTop: spacing.sm }}>
        <Text style={{ color: theme.gold, fontWeight: '700' }}>Politique de confidentialité complète →</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={{ marginTop: spacing.xl, alignSelf: 'center' }}>
        <Text style={{ color: theme.inkSoft, fontWeight: '600' }}>← Retour</Text>
      </Pressable>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={{ color: theme.gold, fontWeight: '700', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        {title}
      </Text>
      <Text style={{ color: theme.inkSoft, fontSize: 14, lineHeight: 20 }}>{children}</Text>
    </View>
  );
}
