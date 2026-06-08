# Phase 2 Plan: Scenes 3 & 4

## Overview
Build Scene 3 (Memories - Polaroid Scatter) and Scene 4 (Love List - Things You Love About Her) with full interactions and transitions.

## Chunk 1: Transition Types Update
**Files:**
- `types/transitions.ts` - Add `fold-into-book` and `sink-to-soil` transition types
- `components/scene-director/TransitionEngine.ts` - Implement new transitions

**New Transitions:**
- `fold-into-book`: Polaroids cluster to center, scale down, and fold into a book shape (translate + scale + rotateX/Y)
- `sink-to-soil`: Book translates down (positive Y) and scales down, garden elements rise from below

## Chunk 2: Scene 03 - Memories (Polaroid Scatter)
**File:** `components/scenes/Scene03_Memories.tsx`

**Data:**
```typescript
interface PolaroidMemory {
  id: number;
  color: string; // placeholder color
  caption: string; // front text
  date: string; // back date
  description: string; // back description
  rotate: number; // initial random rotation
  depth: 'near' | 'mid' | 'far'; // for parallax
}
```

**Features:**
1. 6 polaroid photos with random scatter positions, rotations, and depths
2. Tap to flip 180° on Y-axis with spring physics (Framer Motion `rotateY`)
3. Scroll parallax - deeper items move slower using `useScroll` + `useTransform`
4. Desktop: Polaroids float freely; Mobile: Carousel swipe navigation
5. "Continue" button or scroll-to-bottom triggers `fold-into-book` transition

## Chunk 3: Scene 04 - Love List
**File:** `components/scenes/Scene04_LoveList.tsx`

**Data:**
```typescript
interface LoveTrait {
  id: number;
  text: string; // trait name
  description: string; // optional longer description
}
```

**Features:**
1. 6 traits with gold-foil scratch effect using CSS `clip-path` reveal animation
2. SVG heart beside each trait with `stroke-dashoffset` fill animation on reveal
3. Desktop: Two-page spread (heart illustration left, list right)
4. Mobile: Single column, cards stack vertically
5. Book sinks with `sink-to-soil` transition to next scene

**Heart Illustration:**
- Decorative SVG heart with calligraphy flourishes
- Located on left page/desktop only

## Chunk 4: Build Verification
- Run `npm run build`
- Fix any TypeScript errors
- Verify no console errors

## Implementation Order
1. Update transition types (add new types to transitions.ts)
2. Implement new transitions in TransitionEngine.ts
3. Build Scene03_Memories.tsx
4. Build Scene04_LoveList.tsx
5. Run build and fix errors

## Acceptance Criteria
- [ ] Scene 03 polaroids scatter from center on mount
- [ ] Tap on polaroid flips with spring physics
- [ ] Scroll moves polaroids with parallax (different speeds)
- [ ] "Continue" or scroll-to-bottom triggers fold-into-book transition
- [ ] Scene 04 traits hidden by gold foil on load
- [ ] Gold foil sweeps away revealing trait text on scroll/tap
- [ ] Heart SVG fills with animation on reveal
- [ ] Desktop shows two-page book layout with heart illustration
- [ ] Mobile shows stacked cards
- [ ] `npm run build` passes with no errors