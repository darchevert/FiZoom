export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'V' | 'D' | 'R' | 'A';

export const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'V', 'D', 'R', 'A'];

export const RANK_LABEL: Record<Rank, string> = {
  '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
  V: 'Valet', D: 'Dame', R: 'Roi', A: 'As',
};

export function isRedSuit(suit: Suit) {
  return suit === '♥' || suit === '♦';
}

export interface PlayingCard {
  id: string;
  suit: Suit;
  rank: Rank;
}

export interface GageText {
  normal: string;
  soft: string;
}

export type RuleSet = Record<Rank, GageText>;

export const DEFAULT_RULES: RuleSet = {
  '2': { normal: 'Bois 2 gorgées.', soft: 'Distribue 2 gages à un autre joueur.' },
  '3': { normal: 'Bois 3 gorgées.', soft: 'Distribue 3 gages à un autre joueur.' },
  '4': { normal: 'Bois 4 gorgées.', soft: 'Fais 4 pompes.' },
  '5': { normal: 'Bois 5 gorgées.', soft: 'Raconte une blague, sinon bois.' },
  '6': { normal: 'Bois 6 gorgées.', soft: 'Imite un animal jusqu’à ton prochain tour.' },
  '7': { normal: 'Bois 7 gorgées.', soft: 'Le ciel — dernier à lever la main boit/gage.' },
  '8': { normal: 'Bois 8 gorgées.', soft: 'Choisis un binôme pour le reste de la manche.' },
  '9': { normal: 'Bois 9 gorgées.', soft: 'Rime — le joueur suivant doit rimer avec ton mot.' },
  '10': { normal: 'Bois 10 gorgées.', soft: 'Catégorie — lance un thème, chacun donne un mot.' },
  V: { normal: 'Choisis quelqu’un qui boit avec toi.', soft: 'Choisis quelqu’un qui fait un gage avec toi.' },
  D: { normal: 'FI-ZOOM — cul sec, tu rejoues !', soft: 'FI-ZOOM — finis ton verre (soft), tu rejoues !' },
  R: { normal: 'Tu fixes une règle valable jusqu’à la fin de la partie.', soft: 'Tu fixes une règle valable jusqu’à la fin de la partie.' },
  A: { normal: 'Cascade — tout le monde boit dans l’ordre, en commençant par toi.', soft: 'Cascade — tout le monde fait un gage dans l’ordre, en commençant par toi.' },
};

export function buildShuffledDeck(): PlayingCard[] {
  const cards: PlayingCard[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ id: `${rank}${suit}`, suit, rank });
    }
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function gageFor(rules: RuleSet, card: PlayingCard, softMode: boolean): string {
  const entry = rules[card.rank] ?? DEFAULT_RULES[card.rank];
  return softMode ? entry.soft : entry.normal;
}

export function triggersReplay(card: PlayingCard): boolean {
  return card.rank === 'D';
}
