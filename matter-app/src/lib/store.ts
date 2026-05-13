'use client';
import { create } from 'zustand';
import { EmotionType, sampleBubbles } from './colors';

export type TriageLevel = 'green' | 'yellow' | 'red';
export type Screen = 'home' | 'space' | 'debrief' | 'profile';

export interface Bubble {
  id: string;
  text: string;
  emotion: EmotionType;
  intensity: number;
  x: number;
  y: number;
  frozen?: boolean;
  popped?: boolean;
}

interface MatterStore {
  screen: Screen;
  bubbles: Bubble[];
  triageLevel: TriageLevel;
  inputText: string;
  isRecording: boolean;
  focusedBubble: string | null;
  debriefOpen: boolean;

  setScreen: (s: Screen) => void;
  setInputText: (t: string) => void;
  setRecording: (v: boolean) => void;
  addBubble: (b: Omit<Bubble, 'id' | 'x' | 'y'>) => void;
  popBubble: (id: string) => void;
  freezeBubble: (id: string) => void;
  setFocusedBubble: (id: string | null) => void;
  setTriageLevel: (l: TriageLevel) => void;
  setDebriefOpen: (v: boolean) => void;
  popAll: () => void;
}

export const useMatterStore = create<MatterStore>((set) => ({
  screen: 'home',
  bubbles: sampleBubbles,
  triageLevel: 'green',
  inputText: '',
  isRecording: false,
  focusedBubble: null,
  debriefOpen: false,

  setScreen: (screen) => set({ screen }),
  setInputText: (inputText) => set({ inputText }),
  setRecording: (isRecording) => set({ isRecording }),
  setFocusedBubble: (focusedBubble) => set({ focusedBubble }),
  setTriageLevel: (triageLevel) => set({ triageLevel }),
  setDebriefOpen: (debriefOpen) => set({ debriefOpen }),

  addBubble: (b) =>
    set((s) => ({
      bubbles: [
        ...s.bubbles,
        {
          ...b,
          id: Date.now().toString(),
          x: 10 + Math.random() * 75,
          y: 10 + Math.random() * 70,
        },
      ],
      inputText: '',
    })),

  popBubble: (id) =>
    set((s) => ({ bubbles: s.bubbles.filter((b) => b.id !== id), focusedBubble: null })),

  freezeBubble: (id) =>
    set((s) => ({
      bubbles: s.bubbles.map((b) => (b.id === id ? { ...b, frozen: true } : b)),
      focusedBubble: null,
    })),

  popAll: () => set({ bubbles: [], focusedBubble: null, debriefOpen: false }),
}));
