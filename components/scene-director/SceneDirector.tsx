'use client';

import React, { Suspense, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SceneStateProvider, useSceneState } from './SceneStateProvider';
import SceneShell from './SceneShell';
import { sceneRegistry } from '@/lib/scene-config';

function SceneDirectorInner() {
  const { state, goToScene } = useSceneState();

  const currentScene = sceneRegistry.getScene(state.currentSceneId);

  React.useEffect(() => {
    console.log("CURRENT SCENE =", state.currentSceneId);
    console.log("CURRENT SCENE CONFIG =", currentScene);
  }, [state.currentSceneId, currentScene]);

  const handleSceneComplete = useCallback(() => {
    console.log("SCENE COMPLETE FIRED");

    if (!currentScene) {
      console.log("NO CURRENT SCENE");
      return;
    }

    const nextScene = sceneRegistry.getNextScene(currentScene.id);

    console.log("NEXT SCENE =", nextScene);

    if (nextScene) {
      console.log("MOVING TO =", nextScene.id);
      goToScene(nextScene.id);
    } else {
      console.log("NO NEXT SCENE FOUND");
    }
  }, [currentScene, goToScene]);

  if (!currentScene) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        NO CURRENT SCENE
      </div>
    );
  }

  const SceneComponent = currentScene.component;

  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <SceneComponent
          isActive={true}
          onComplete={handleSceneComplete}
        />
      </Suspense>
    </div>
  );
}

export default function SceneDirector() {
  return (
    <SceneStateProvider>
      <SceneDirectorInner />
    </SceneStateProvider>
  );
}

// Hook for scenes to navigate programmatically
export function useSceneNavigation() {
  const { goToScene, state } = useSceneState();

  const navigateToNext = useCallback(() => {
    const nextScene = sceneRegistry.getNextScene(state.currentSceneId);
    if (nextScene) {
      goToScene(nextScene.id);
    }
  }, [state.currentSceneId, goToScene]);

  const navigateToPrevious = useCallback(() => {
    const prevScene = sceneRegistry.getPreviousScene(state.currentSceneId);
    if (prevScene) {
      goToScene(prevScene.id);
    }
  }, [state.currentSceneId, goToScene]);

  const navigateToScene = useCallback(
    (sceneId: number) => {
      const scene = sceneRegistry.getScene(sceneId);
      if (scene) {
        goToScene(sceneId);
      }
    },
    [goToScene]
  );

  return {
    currentSceneId: state.currentSceneId,
    isTransitioning: state.isTransitioning,
    navigateToNext,
    navigateToPrevious,
    navigateToScene,
    canGoNext: sceneRegistry.getNextScene(state.currentSceneId) !== undefined,
    canGoPrevious: sceneRegistry.getPreviousScene(state.currentSceneId) !== undefined,
  };
}