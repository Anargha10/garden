import { lazy } from 'react';
import { SceneConfig, SceneRegistry } from '@/types/scene';
import { TransitionType } from '@/types/transitions';

// Lazy load all scenes for code splitting
const Scene00_Gate = lazy(() => import('@/components/scenes/Scene00_Gate'));
const Scene01_Cover = lazy(() => import('@/components/scenes/Scene01_Cover'));
const Scene02_Letter = lazy(() => import('@/components/scenes/Scene02_Letter'));
const Scene03_Memories = lazy(() => import('@/components/scenes/Scene03_Memories'));
const Scene04_LoveList = lazy(() => import('@/components/scenes/Scene04_LoveList'));
const Scene05_Garden = lazy(() => import('@/components/scenes/Scene05_Garden'));
const Scene06_Bouquet = lazy(() => import('@/components/scenes/Scene06_Bouquet'));
const Scene07_FinalLetter = lazy(() => import('@/components/scenes/Scene07_FinalLetter'));
const Scene08_Stardust = lazy(() => import('@/components/scenes/Scene08_Stardust'));

// Scene registry - all 9 scenes for The Garden Inside My Heart
export const SCENE_CONFIG: SceneConfig[] = [
  {
    id: 0,
    slug: 'gate',
    name: 'The Hidden Gate',
    description: 'Enter the garden through the mystical gate',
    duration: -1, // Infinite until passphrase entered
    component: Scene00_Gate,
    transitionIn: 'none',
    transitionOut: 'iris-expand',
    transitionDuration: 1200,
    requiresUnlock: true,
    passphrase: 'shona bor',
  },
  {
    id: 1,
    slug: 'cover',
    name: 'The Diary Cover',
    description: 'A beautifully bound journal awaits',
    duration: -1, // Infinite until interaction
    component: Scene01_Cover,
    transitionIn: 'iris-expand',
    transitionOut: 'page-turn-3d',
    transitionDuration: 1500,
    requiresUnlock: false,
  },
  {
    id: 2,
    slug: 'letter',
    name: 'The Letter',
    description: 'The first letter reveals itself',
    duration: -1,
    component: Scene02_Letter,
    transitionIn: 'dissolve-up',
    transitionOut: 'dissolve-up',
    transitionDuration: 800,
    requiresUnlock: false,
  },
  {
    id: 3,
    slug: 'memories',
    name: 'Treasured Memories',
    description: 'Moments frozen in time',
    duration: -1, // Infinite until user continues
    component: Scene03_Memories,
    transitionIn: 'dissolve-up',
    transitionOut: 'fold-into-book',
    transitionDuration: 1500,
    requiresUnlock: false,
  },
  {
    id: 4,
    slug: 'love-list',
    name: 'A List of Love',
    description: 'All the things I love about you',
    duration: -1, // Infinite until all traits revealed
    component: Scene04_LoveList,
    transitionIn: 'fold-into-book',
    transitionOut: 'sink-to-soil',
    transitionDuration: 2000,
    requiresUnlock: false,
  },
  {
    id: 5,
    slug: 'garden',
    name: 'Our Garden',
    description: 'A blooming sanctuary of love',
    duration: 30000, // 30 seconds
    component: Scene05_Garden,
    transitionIn: 'dissolve-up',
    transitionOut: 'dissolve-up',
    transitionDuration: 800,
    requiresUnlock: false,
  },
  {
    id: 6,
    slug: 'bouquet',
    name: 'A Bouquet of Words',
    description: 'Each flower holds a sentiment',
    duration: 30000, // 30 seconds (as specified)
    component: Scene06_Bouquet,
    transitionIn: 'dissolve-up',
    transitionOut: 'rose-petal-dissolve', // Uses rose-petal-dissolve for Scene 6→7 transition
    transitionDuration: 2000,
    requiresUnlock: false,
  },
  {
    id: 7,
    slug: 'final-letter',
    name: 'The Final Letter',
    description: 'My heart laid bare',
    duration: -1,
    component: Scene07_FinalLetter,
    transitionIn: 'rose-petal-dissolve',
    transitionOut: 'rose-petal-dissolve',
    transitionDuration: 2000,
    requiresUnlock: false,
  },
  {
    id: 8,
    slug: 'stardust',
    name: 'Stardust',
    description: 'Where love becomes eternal',
    duration: -1, // Infinite (as specified)
    component: Scene08_Stardust,
    transitionIn: 'dissolve-up',
    transitionOut: 'none',
    transitionDuration: 1000,
    requiresUnlock: false,
  },
];

// Build a Map for O(1) lookups
const sceneMap = new Map<number, SceneConfig>(
  SCENE_CONFIG.map((scene) => [scene.id, scene])
);

// Scene registry with helper methods
export const sceneRegistry: SceneRegistry = {
  scenes: sceneMap,

  getScene(id: number): SceneConfig | undefined {
    return this.scenes.get(id);
  },

  getNextScene(currentId: number): SceneConfig | undefined {
    const nextId = currentId + 1;
    return this.scenes.get(nextId);
  },

  getPreviousScene(currentId: number): SceneConfig | undefined {
    if (currentId <= 0) return undefined;
    return this.scenes.get(currentId - 1);
  },

  getSceneBySlug(slug: string): SceneConfig | undefined {
    return SCENE_CONFIG.find((scene) => scene.slug === slug);
  },
};

// Get all scene IDs in order
export const SCENE_IDS = SCENE_CONFIG.map((scene) => scene.id);

// Get total scene count
export const SCENE_COUNT = SCENE_CONFIG.length;