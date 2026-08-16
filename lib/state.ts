import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { DEFAULT_RULES, PlayingCard, RuleSet, buildShuffledDeck, triggersReplay, type Rank } from './deck';

const STORAGE_KEY = 'fizoom:v1';

export interface RuleDeck {
  id: string;
  name: string;
  editable: boolean;
  rules: RuleSet;
}

export interface Settings {
  soundOn: boolean;
  softMode: boolean;
}

export interface GameSession {
  players: string[];
  deck: PlayingCard[];
  drawn: PlayingCard[];
  currentPlayerIndex: number;
  fizoomCount: number;
  current: PlayingCard | null;
  revealed: boolean;
  finished: boolean;
}

interface PersistedState {
  ageVerified: boolean;
  players: string[];
  decks: RuleDeck[];
  selectedDeckId: string;
  settings: Settings;
}

interface AppState extends PersistedState {
  hydrated: boolean;
  session: GameSession | null;
}

const CLASSIC_DECK: RuleDeck = {
  id: 'classique',
  name: 'Classique',
  editable: false,
  rules: DEFAULT_RULES,
};

const initialState: AppState = {
  hydrated: false,
  ageVerified: false,
  players: [],
  decks: [CLASSIC_DECK],
  selectedDeckId: CLASSIC_DECK.id,
  settings: { soundOn: true, softMode: false },
  session: null,
};

type Action =
  | { type: 'hydrate'; payload: Partial<PersistedState> }
  | { type: 'verifyAge' }
  | { type: 'setPlayers'; players: string[] }
  | { type: 'selectDeck'; id: string }
  | { type: 'addDeck'; deck: RuleDeck }
  | { type: 'updateDeckRule'; deckId: string; rank: Rank; normal: string; soft: string }
  | { type: 'renameDeck'; deckId: string; name: string }
  | { type: 'deleteDeck'; deckId: string }
  | { type: 'toggleSound' }
  | { type: 'toggleSoftMode' }
  | { type: 'startGame' }
  | { type: 'addPlayerToSession'; name: string }
  | { type: 'drawCard' }
  | { type: 'nextTurn' }
  | { type: 'endGame' }
  | { type: 'clearSession' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload, hydrated: true };
    case 'verifyAge':
      return { ...state, ageVerified: true };
    case 'setPlayers':
      return { ...state, players: action.players };
    case 'selectDeck':
      return { ...state, selectedDeckId: action.id };
    case 'addDeck':
      return { ...state, decks: [...state.decks, action.deck], selectedDeckId: action.deck.id };
    case 'updateDeckRule':
      return {
        ...state,
        decks: state.decks.map((d) =>
          d.id === action.deckId
            ? { ...d, rules: { ...d.rules, [action.rank]: { normal: action.normal, soft: action.soft } } }
            : d
        ),
      };
    case 'renameDeck':
      return {
        ...state,
        decks: state.decks.map((d) => (d.id === action.deckId ? { ...d, name: action.name } : d)),
      };
    case 'deleteDeck': {
      const remaining = state.decks.filter((d) => d.id !== action.deckId);
      return {
        ...state,
        decks: remaining,
        selectedDeckId: state.selectedDeckId === action.deckId ? CLASSIC_DECK.id : state.selectedDeckId,
      };
    }
    case 'toggleSound':
      return { ...state, settings: { ...state.settings, soundOn: !state.settings.soundOn } };
    case 'toggleSoftMode':
      return { ...state, settings: { ...state.settings, softMode: !state.settings.softMode } };
    case 'startGame':
      return {
        ...state,
        session: {
          players: state.players.length > 0 ? state.players : ['Joueur 1'],
          deck: buildShuffledDeck(),
          drawn: [],
          currentPlayerIndex: 0,
          fizoomCount: 0,
          current: null,
          revealed: false,
          finished: false,
        },
      };
    case 'addPlayerToSession': {
      if (!state.session) return state;
      const name = action.name.trim();
      if (!name) return state;
      return { ...state, session: { ...state.session, players: [...state.session.players, name] } };
    }
    case 'drawCard': {
      if (!state.session || state.session.deck.length === 0) return state;
      const [card, ...rest] = state.session.deck;
      return {
        ...state,
        session: {
          ...state.session,
          deck: rest,
          drawn: [...state.session.drawn, card],
          current: card,
          revealed: true,
          fizoomCount: state.session.fizoomCount + (triggersReplay(card) ? 1 : 0),
          finished: rest.length === 0,
        },
      };
    }
    case 'nextTurn': {
      if (!state.session) return state;
      const replay = state.session.current ? triggersReplay(state.session.current) : false;
      const nextIndex = replay
        ? state.session.currentPlayerIndex
        : (state.session.currentPlayerIndex + 1) % state.session.players.length;
      return {
        ...state,
        session: { ...state.session, currentPlayerIndex: nextIndex, current: null, revealed: false },
      };
    }
    case 'endGame':
      return { ...state, session: state.session ? { ...state.session, finished: true } : null };
    case 'clearSession':
      return { ...state, session: null };
    default:
      return state;
  }
}

interface AppContextValue extends AppState {
  verifyAge: () => void;
  setPlayers: (players: string[]) => void;
  selectDeck: (id: string) => void;
  addDeck: (name: string, base: RuleSet) => string;
  updateDeckRule: (deckId: string, rank: Rank, normal: string, soft: string) => void;
  renameDeck: (deckId: string, name: string) => void;
  deleteDeck: (deckId: string) => void;
  toggleSound: () => void;
  toggleSoftMode: () => void;
  startGame: () => void;
  addPlayerToSession: (name: string) => void;
  drawCard: () => void;
  nextTurn: () => void;
  endGame: () => void;
  clearSession: () => void;
  activeDeck: RuleDeck;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState>;
          dispatch({ type: 'hydrate', payload: parsed });
        } else {
          dispatch({ type: 'hydrate', payload: {} });
        }
      } catch {
        dispatch({ type: 'hydrate', payload: {} });
      }
    })();
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const toPersist: PersistedState = {
      ageVerified: state.ageVerified,
      players: state.players,
      decks: state.decks,
      selectedDeckId: state.selectedDeckId,
      settings: state.settings,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist)).catch(() => {});
  }, [state.ageVerified, state.players, state.decks, state.selectedDeckId, state.settings, state.hydrated]);

  const addDeck = useCallback((name: string, base: RuleSet) => {
    const id = `deck-${Date.now()}`;
    dispatch({ type: 'addDeck', deck: { id, name, editable: true, rules: { ...base } } });
    return id;
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      activeDeck: state.decks.find((d) => d.id === state.selectedDeckId) ?? CLASSIC_DECK,
      verifyAge: () => dispatch({ type: 'verifyAge' }),
      setPlayers: (players) => dispatch({ type: 'setPlayers', players }),
      selectDeck: (id) => dispatch({ type: 'selectDeck', id }),
      addDeck,
      updateDeckRule: (deckId, rank, normal, soft) => dispatch({ type: 'updateDeckRule', deckId, rank, normal, soft }),
      renameDeck: (deckId, name) => dispatch({ type: 'renameDeck', deckId, name }),
      deleteDeck: (deckId) => dispatch({ type: 'deleteDeck', deckId }),
      toggleSound: () => dispatch({ type: 'toggleSound' }),
      toggleSoftMode: () => dispatch({ type: 'toggleSoftMode' }),
      startGame: () => dispatch({ type: 'startGame' }),
      addPlayerToSession: (name) => dispatch({ type: 'addPlayerToSession', name }),
      drawCard: () => dispatch({ type: 'drawCard' }),
      nextTurn: () => dispatch({ type: 'nextTurn' }),
      endGame: () => dispatch({ type: 'endGame' }),
      clearSession: () => dispatch({ type: 'clearSession' }),
    }),
    [state, addDeck]
  );

  return React.createElement(AppContext.Provider, { value }, children);
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
