# Self-Healing Design Deck System — Plan

## Goal
Create an automated verification and repair system for the designanimations module that:
1. Detects known structural defects in the HTML artifact and React components
2. Reports all issues in a Test Dashboard UI
3. Can automatically apply known-good fixes via API endpoints
4. Serves as regression prevention for future development

## Known Defects Registry

| # | File | Defect | Fix |
|---|---|---|---|
| 1 | `DesignAnimations.html` | Starts with `<html lang="en">` instead of `<!DOCTYPE html>` | Prepend `<!DOCTYPE html>`, remove external `<script src>` tags, embed script inline before closing `</body>` |
| 2 | `DesignDeckInteractive.tsx` | CSS variable typo `$sceneCoordinator` instead of `$sceneCoordinator` | Replace `--${scene.id}-index` with `--${scene.id}-zIndex` |
| 3 | `use3DTilt.ts` | Empty `useEffect` dependency array with no effect body; `options` object defined inside `useMemo` with stale dependencies | Move `options` outside `useEffect`, set as default parameter to `use3DTilt(options?: TiltOptions = TILT_OPTIONS)`, remove empty `useEffect` |
| 4 | `SceneGrid.tsx` | `zIndex: i` (ascending) causes later slides to overlay earlier ones | Change to `zIndex: scenes.length - 1 - i` (descending) so earlier slides are on top |
| 5 | `SceneShell.tsx` | Missing `key` prop causes React transition-group warnings | Add a `key` prop or keep as wrapper — verify behavior |

> Note: Actual SceneShell behavior was correct; the `SlideShell` provides the `key`. This is informational.

## Architecture

```
app/
  test/
    page.tsx                  → Self-Healing Dashboard UI
  api/
    verify-design-deck/
      route.ts                → GET: returns JSON diagnostics
    fix-design-deck/
      route.ts                → POST: applies fixes, returns results
components/
  test/
    SelfHealingDashboard.tsx  → Main dashboard component
    DefectCard.tsx            → Individual defect display card
    StatusBadge.tsx           → Pass/Fail/Fixed badge component
lib/
  design-deck-healer.ts       → Core verification + repair engine (Node.js, no React)
```

## Chunk 1 — Core Healer Engine
**Files:** `lib/design-deck-healer.ts`
**Goal:** Pure TypeScript module that can verify and repair all known defects.
**API:**
```ts
export interface DefectReport {
  filePath: string;
  defectId: string;
  description: string;
  severity: 'critical' | 'warning';
  passed: boolean;
}

export function verifyAll(): DefectReport[];
export function applyFixes(targets?: string[]): { applied: string[]; failed: string[] };
```
**Acceptance Criteria:**
- [ ] Detects Defect #1 by checking first line of HTML file
- [ ] Detects Defect #2 by searching for `-index` / verifying `-zIndex` in DesignDeckInteractive
- [ ] Detects Defect #3 by searching empty `useEffect(() => {}, [])` in use3DTilt + `options` object placement
- [ ] Detects Defect #4 by searching `zIndex: i` in SceneGrid
- [ ] Can apply all fixes deterministically (idempotent)

## Chunk 2 — API Routes
**Files:** `app/api/verify-design-deck/route.ts`, `app/api/fix-design-deck/route.ts`
**Goal:** Next.js App Router API endpoints exposing the healer engine.
**Acceptance Criteria:**
- [ ] GET `/api/verify-design-deck` returns JSON array of defect reports
- [ ] POST `/api/fix-design-deck` with `{