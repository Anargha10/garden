export type TransitionType =
  | 'iris-expand'
  | 'dissolve-up'
  | 'page-turn-3d'
  | 'rose-petal-dissolve'
  | 'fold-into-book'
  | 'sink-to-soil'
  | 'fade'
  | 'none';

export interface TransitionConfig {
  type: TransitionType;
  duration: number;
  easing?: string;
  delay?: number;
}

export interface TransitionTimeline {
  play: () => Promise<void>;
  reverse: () => Promise<void>;
  kill: () => void;
  progress: () => number;
  eventCallback: (callback: TransitionEventCallback) => void;
}

export type TransitionEventCallback = (event: TransitionEvent) => void;

export interface TransitionEvent {
  type: 'start' | 'complete' | 'reverseComplete';
  direction: 'in' | 'out';
}

export interface TransitionRegistry {
  [key: string]: (container: HTMLElement, config: TransitionConfig) => TransitionTimeline;
}

// Transition metadata for scene config
export const TRANSITION_META: Record<TransitionType, { defaultDuration: number; description: string }> = {
  'iris-expand': { defaultDuration: 1200, description: 'Circle expands from center like an iris diaphragm' },
  'dissolve-up': { defaultDuration: 800, description: 'Fade out with upward drift' },
  'page-turn-3d': { defaultDuration: 1500, description: '3D page turn effect' },
  'rose-petal-dissolve': { defaultDuration: 2000, description: 'Petals fall as scene dissolves' },
  'fold-into-book': { defaultDuration: 1500, description: 'Polaroids fold and cluster into book shape' },
  'sink-to-soil': { defaultDuration: 2000, description: 'Book sinks into soil, garden rises' },
  'fade': { defaultDuration: 600, description: 'Simple cross-fade' },
  'none': { defaultDuration: 0, description: 'No transition' },
};