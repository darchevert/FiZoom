# FiZoom 🃏

Adaptation mobile (Android/iOS) du jeu à boire de cartes classiques **FiZoom**, en mode
pass-and-play : un seul téléphone circule autour de la table, chaque joueur pioche à son tour.

Carte piochée → gage affiché en plein écran (ex : 2 = bois 2 gorgées, Dame = **Fi-Zoom** — cul
sec et rejoue).

## Stack

- [Expo](https://expo.dev) (React Native + TypeScript), managed workflow
- [expo-router](https://docs.expo.dev/router/introduction/) pour la navigation
- Stockage 100% local (`@react-native-async-storage/async-storage`) — pas de backend, pas de compte
- Cartes dessinées en code (`components/PlayingCard.tsx`), pas d'assets graphiques externes

## Lancer le projet

```bash
npm install
npm run web      # aperçu rapide dans le navigateur
npm start         # QR code à scanner avec l'app Expo Go (Android/iOS)
```

Aucun outil natif (Xcode/Android Studio) requis pour développer et tester : Expo Go suffit sur
un téléphone réel. Pour générer les binaires de soumission aux stores, voir
[EAS Build](https://docs.expo.dev/build/introduction/) (build cloud, gratuit dans la limite du
tier gratuit).

## Structure

```
app/            écrans (routing par fichier, expo-router)
components/     composants réutilisables (carte, bouton, écran)
lib/            état applicatif, moteur de jeu, thème
docs/           page GitHub Pages (politique de confidentialité, requise par les stores)
```

## Écrans

Splash → Vérification d'âge → Accueil → Configuration partie → Table de jeu (pioche + gage) →
Fin de partie, plus Éditeur de règles et Paramètres accessibles depuis l'accueil.

## Conformité stores

Contenu réservé aux 18+ (référence à l'alcool). Vérification d'âge réelle à l'ouverture, mode
« soft » sans alcool disponible dans les paramètres, aucune donnée envoyée à un serveur. Voir
[docs/privacy.html](docs/privacy.html).

## Licence

À définir.
