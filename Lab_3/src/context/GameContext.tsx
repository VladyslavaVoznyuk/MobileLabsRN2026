import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Challenge {
  id: string;
  icon: string;
  title: string;
  desc: string;
  target: number;
  current: number;
  type: string;
}

export interface GameState {
  score: number;
  highScore: number;
  taps: number;
  doubleTaps: number;
  longPresses: number;
  swipes: number;
  swipesRight: number;
  swipesLeft: number;
  pans: number;
  pinches: number;
  scale: number;
  uniqueGestureTypes: Set<string>;
  challenges: Challenge[];
}

interface GameContextType {
  state: GameState;
  addScore: (pts: number, gesture: string) => string | null;
  resetGame: () => void;
}

const initialChallenges: Challenge[] = [
  { id: 'c1', icon: '☝️', title: 'Tap 10 times', desc: 'Tap on the clicker object 10 times', target: 10, type: 'taps', current: 0 },
  { id: 'c2', icon: '✌️', title: 'Double-tap 5 times', desc: 'Double-tap on the clicker 5 times', target: 5, type: 'doubleTaps', current: 0 },
  { id: 'c3', icon: '✊', title: 'Long press 3 seconds', desc: 'Hold the clicker for 3 seconds', target: 1, type: 'longPresses', current: 0 },
  { id: 'c4', icon: '✋', title: 'Drag the object', desc: 'Drag the clicker around the screen', target: 1, type: 'pans', current: 0 },
  { id: 'c5', icon: '👉', title: 'Swipe right', desc: 'Perform a quick swipe right gesture', target: 1, type: 'swipesRight', current: 0 },
  { id: 'c6', icon: '👈', title: 'Swipe left', desc: 'Perform a quick swipe left gesture', target: 1, type: 'swipesLeft', current: 0 },
  { id: 'c7', icon: '🤏', title: 'Pinch to resize', desc: 'Use pinch gesture to resize the clicker', target: 1, type: 'pinches', current: 0 },
  { id: 'c8', icon: '🏆', title: 'Reach 100 points', desc: 'Score a total of 100 points', target: 100, type: 'score', current: 0 },
  { id: 'c9', icon: '🌟', title: 'Gesture master', desc: 'Use all 5 different gesture types at least once', target: 5, type: 'uniqueGestures', current: 0 },
];

function createInitialState(): GameState {
  return {
    score: 0,
    highScore: 0,
    taps: 0,
    doubleTaps: 0,
    longPresses: 0,
    swipes: 0,
    swipesRight: 0,
    swipesLeft: 0,
    pans: 0,
    pinches: 0,
    scale: 1,
    uniqueGestureTypes: new Set(),
    challenges: initialChallenges.map(c => ({ ...c })),
  };
}

const GameContext = createContext<GameContextType>({
  state: createInitialState(),
  addScore: () => null,
  resetGame: () => {},
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(createInitialState());

  const addScore = useCallback((pts: number, gesture: string): string | null => {
    let toastMessage: string | null = null;

    setState(prev => {
      const next = { ...prev };
      next.score = prev.score + pts;
      if (next.score > prev.highScore) next.highScore = next.score;

      if (gesture === 'tap') {
        next.taps = prev.taps + 1;
      } else if (gesture === 'double') {
        next.taps = prev.taps + 1;
        next.doubleTaps = prev.doubleTaps + 1;
      } else if (gesture === 'long') {
        next.longPresses = prev.longPresses + 1;
      } else if (gesture === 'swipe-right') {
        next.swipes = prev.swipes + 1;
        next.swipesRight = prev.swipesRight + 1;
      } else if (gesture === 'swipe-left') {
        next.swipes = prev.swipes + 1;
        next.swipesLeft = prev.swipesLeft + 1;
      } else if (gesture === 'pan') {
        next.pans = prev.pans + 1;
      } else if (gesture === 'pinch') {
        next.pinches = prev.pinches + 1;
        const newScale = Math.max(0.5, Math.min(2.0, prev.scale + (Math.random() > 0.5 ? 0.15 : -0.1)));
        next.scale = parseFloat(newScale.toFixed(2));
      }

      const newUniqueGestures = new Set(prev.uniqueGestureTypes);
      const gestureCategory = gesture.startsWith('swipe') ? 'swipe' : gesture;
      newUniqueGestures.add(gestureCategory);
      next.uniqueGestureTypes = newUniqueGestures;

      next.challenges = prev.challenges.map(c => {
        let current = c.current;
        switch (c.type) {
          case 'taps': current = Math.min(next.taps, c.target); break;
          case 'doubleTaps': current = Math.min(next.doubleTaps, c.target); break;
          case 'longPresses': current = Math.min(next.longPresses, c.target); break;
          case 'pans': current = Math.min(next.pans, c.target); break;
          case 'swipesRight': current = Math.min(next.swipesRight, c.target); break;
          case 'swipesLeft': current = Math.min(next.swipesLeft, c.target); break;
          case 'pinches': current = Math.min(next.pinches, c.target); break;
          case 'score': current = Math.min(next.score, c.target); break;
          case 'uniqueGestures': current = Math.min(next.uniqueGestureTypes.size, c.target); break;
        }
        if (current >= c.target && c.current < c.target) {
          toastMessage = `✅ Challenge done: "${c.title}"`;
        }
        return { ...c, current };
      });

      return next;
    });

    return toastMessage;
  }, []);

  const resetGame = useCallback(() => {
    setState(createInitialState());
  }, []);

  return (
    <GameContext.Provider value={{ state, addScore, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
