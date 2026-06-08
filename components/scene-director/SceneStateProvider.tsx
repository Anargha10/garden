'use client';

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { SceneState, SceneAction, SceneConfig } from '@/types/scene';
import { sceneRegistry } from '@/lib/scene-config';

const initialState: SceneState = {
  currentSceneId: 0,
  previousSceneId: null,
  isTransitioning: false,
  isUnlocked: false,
  unlockedScenes: [],
  passphrase: '',
  sceneStartTime: null,
};

function sceneReducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case 'GO_TO_SCENE':
      return {
        ...state,
        previousSceneId: state.currentSceneId,
        currentSceneId: action.payload,
        isTransitioning: false,
        sceneStartTime: Date.now(),
      };

    case 'START_TRANSITION':
      return {
        ...state,
        isTransitioning: true,
      };

    case 'END_TRANSITION':
      return {
        ...state,
        isTransitioning: false,
      };

    case 'UNLOCK_SCENE':
      return {
        ...state,
        isUnlocked: true,
        unlockedScenes: [...state.unlockedScenes, action.payload.sceneId],
        passphrase: action.payload.passphrase,
      };

    case 'SET_PASSPHRASE':
      return {
        ...state,
        passphrase: action.payload,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

interface SceneContextValue {
  state: SceneState;
  currentScene: SceneConfig | undefined;
  goToScene: (sceneId: number) => void;
  startTransition: (from: number, to: number) => void;
  endTransition: () => void;
  unlockScene: (sceneId: number, passphrase: string) => void;
  setPassphrase: (passphrase: string) => void;
  reset: () => void;
  isSceneUnlocked: (sceneId: number) => boolean;
  canNavigateToScene: (sceneId: number) => boolean;
}

const SceneContext = createContext<SceneContextValue | null>(null);

interface SceneStateProviderProps {
  children: React.ReactNode;
}

export function SceneStateProvider({ children }: SceneStateProviderProps) {
  const [state, dispatch] = useReducer(sceneReducer, initialState);

  const currentScene = useMemo(
    () => sceneRegistry.getScene(state.currentSceneId),
    [state.currentSceneId]
  );

  const goToScene = useCallback((sceneId: number) => {
    dispatch({ type: 'GO_TO_SCENE', payload: sceneId });
  }, []);

  const startTransition = useCallback((from: number, to: number) => {
    dispatch({ type: 'START_TRANSITION', payload: { from, to } });
  }, []);

  const endTransition = useCallback(() => {
    dispatch({ type: 'END_TRANSITION' });
  }, []);

  const unlockScene = useCallback((sceneId: number, passphrase: string) => {
    dispatch({ type: 'UNLOCK_SCENE', payload: { sceneId, passphrase } });
  }, []);

  const setPassphrase = useCallback((passphrase: string) => {
    dispatch({ type: 'SET_PASSPHRASE', payload: passphrase });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const isSceneUnlocked = useCallback(
    (sceneId: number) => {
      return state.unlockedScenes.includes(sceneId);
    },
    [state.unlockedScenes]
  );

  const canNavigateToScene = useCallback(
    (sceneId: number) => {
      // Can always go to scene 0
      if (sceneId === 0) return true;
      
      // Can go to unlocked scenes
      if (state.unlockedScenes.includes(sceneId)) return true;
      
      // Can go to scenes that don't require unlock
      const scene = sceneRegistry.getScene(sceneId);
      if (scene && !scene.requiresUnlock) return true;
      
      return false;
    },
    [state.unlockedScenes]
  );

  const value = useMemo(
    () => ({
      state,
      currentScene,
      goToScene,
      startTransition,
      endTransition,
      unlockScene,
      setPassphrase,
      reset,
      isSceneUnlocked,
      canNavigateToScene,
    }),
    [
      state,
      currentScene,
      goToScene,
      startTransition,
      endTransition,
      unlockScene,
      setPassphrase,
      reset,
      isSceneUnlocked,
      canNavigateToScene,
    ]
  );

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}

export function useSceneState(): SceneContextValue {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useSceneState must be used within a SceneStateProvider');
  }
  return context;
}

export { SceneContext };
export type { SceneContextValue };