import { TransitionType } from './transitions';

export interface SceneConfig {
  id: number;
  slug: string;
  name: string;
  description: string;
  duration: number; // in milliseconds, -1 for infinite
  component: React.LazyExoticComponent<React.ComponentType<SceneProps>>;
  transitionIn: TransitionType;
  transitionOut: TransitionType;
  transitionDuration: number;
  requiresUnlock: boolean;
  passphrase?: string;
}

export interface SceneProps {
  isActive: boolean;
  onComplete?: () => void;
  onUnlock?: () => void;
}

export interface SceneState {
  currentSceneId: number;
  previousSceneId: number | null;
  isTransitioning: boolean;
  isUnlocked: boolean;
  unlockedScenes: number[];
  passphrase: string;
  sceneStartTime: number | null;
}

export type SceneAction =
  | { type: 'GO_TO_SCENE'; payload: number }
  | { type: 'START_TRANSITION'; payload: { from: number; to: number } }
  | { type: 'END_TRANSITION' }
  | { type: 'UNLOCK_SCENE'; payload: { sceneId: number; passphrase: string } }
  | { type: 'SET_PASSPHRASE'; payload: string }
  | { type: 'RESET' };

export interface SceneRegistry {
  scenes: Map<number, SceneConfig>;
  getScene: (id: number) => SceneConfig | undefined;
  getNextScene: (currentId: number) => SceneConfig | undefined;
  getPreviousScene: (currentId: number) => SceneConfig | undefined;
  getSceneBySlug: (slug: string) => SceneConfig | undefined;
}

export interface SceneRenderable {
  render: (props: SceneProps) => React.ReactNode;
}