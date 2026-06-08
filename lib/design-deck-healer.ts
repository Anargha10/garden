/**
 * Design Deck Self-Healing Engine
 *
 * Verifies known structural defects in the designanimations module
 * and applies deterministic fixes.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

export interface DefectReport {
  defectId: string;
  filePath: string;
  description: string;
  severity: 'critical' | 'warning';
  passed: boolean;
  details?: string;
}

export interface HealResult {
  reports: DefectReport[];
  appliedFixes: string[];
  failedFixes: string[];
}

function readFile(relPath: string): string | null {
  const fullPath = join(ROOT, relPath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, 'utf-8');
}

function writeFile(relPath: string, content: string) {
  writeFileSync(join(ROOT, relPath), content, 'utf-8');
}

/* ── Verifiers ────────────────────────────────────────── */

function verifyHtmlDoctype(content: string): DefectReport {
  const hasDoctype = content.trimStart().startsWith('<!DOCTYPE html>');
  const hasExternalScript = /<script\s+src\s*=/.test(content);

  const passed = hasDoctype && !hasExternalScript;

  return {
    defectId: 'HTML-001',
    filePath: 'components/designanimations/DesignAnimations.html',
    description:
      'HTML artifact must declare <!DOCTYPE html> and embed the Swiper script inline (not via external <script src>).',
    severity: 'critical',
    passed,
    details: !hasDoctype
      ? 'Missing <!DOCTYPE html> at file start.'
      : hasExternalScript
        ? 'Found external <script src="..."> tag(s). Remove them and embed the script inline before </body>.'
        : undefined,
  };
}

function fixHtmlDoctype(content: string): string {
  let fixed = content;

  // Ensure DOCTYPE
  if (!fixed.trimStart().startsWith('<!DOCTYPE html>')) {
    fixed = '<!DOCTYPE html>\n' + fixed.replace(/<html[^>]*>/i, '<html lang="en">');
  }

  // Remove external script tags
  fixed = fixed.replace(/<script\s+src\s*=\s*"[^"]*"[^>]*>\s*<\/script>/g, '');

  return fixed;
}

function verifyDesignDeckInteractive(content: string): DefectReport {
  // The correct line should contain `--${scene.id}-zIndex`
  const hasCorrectZIndex = /--\$\{scene\.id\}-zIndex/.test(content);
  const hasWrongIndex = /--\$\{scene\.id\}-index/.test(content);

  return {
    defectId: 'REACT-002',
    filePath: 'app/designanimations/DesignDeckInteractive.tsx',
    description:
      'CSS variable name in DesignDeckInteractive must `--${scene.id}-zIndex` to match the `$sceneCoordinator` reading in the SCSS.',
    severity: 'critical',
    passed: hasCorrectZIndex || !hasWrongIndex,
    details: hasWrongIndex ? "Found `--${scene.id}-index`, should be `--${scene.id}-zIndex`." : undefined,
  };
}

function fixDesignDeckInteractive(content: string): string {
  return content.replace(/--\$\{scene\.id\}-index/g, '--${scene.id}-zIndex');
}

function verifyUse3DTilt(content: string): DefectReport {
  // Check for empty useEffect
  const emptyUseEffect = /useEffect\(\s*\(\)\s*=>\s*\{\s*\}\s*,\s*\[\s*\]\s*\)/.test(content);
  // Check if options object is defined inside a hook (useMemo) instead of module scope
  const optionsInUseMemo = /useMemo\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?options\s*:/.test(content);
  // Better check: see if the TILT_OPTIONS constant exists at module level
  const hasModuleOptions = /const\s+TILT_OPTIONS\s*=/.test(content);

  return {
    defectId: 'REACT-003',
    filePath: 'app/designanimations/hooks/use3DTilt.ts',
    description:
      'use3DTilt must define its option defaults as a module-level constant and must not contain an empty useEffect.',
    severity: 'critical',
    passed: !emptyUseEffect && hasModuleOptions,
    details: emptyUseEffect
      ? 'Found empty useEffect(() => {}, [])'
      : !hasModuleOptions
        ? 'Missing module-level TILT_OPTIONS constant.'
        : undefined,
  };
}

function fixUse3DTilt(content: string): string {
  let fixed = content;

  // Remove empty useEffect
  fixed = fixed.replace(
    /useEffect\s*\(\s*\(\)\s*=>\s*\{\s*\}\s*,\s*\[\s*\]\s*\);?\s*/,
    ''
  );

  // If there's no module-level TILT_OPTIONS but there is one inside useMemo, extract it
  if (!/const\s+TILT_OPTIONS\s*=/.test(fixed)) {
    const useMemoMatch = fixed.match(
      /const\s+options\s*=\s*useMemo\s*\(\s*\(\)\s*=>\s*(\{[\s\S]*?\})\s*,\s*\[\]\s*\)/
    );
    if (useMemoMatch) {
      const optionsObj = useMemoMatch[1];
      fixed = fixed.replace(useMemoMatch[0], '');
      fixed = `const TILT_OPTIONS = ${optionsObj};\n\n` + fixed;
      // Replace destructured `options` access with `TILT_OPTIONS` inside the hook
      fixed = fixed.replace(/\boptions\b/g, 'TILT_OPTIONS');
    }
  }

  return fixed;
}

function verifySceneGrid(content: string): DefectReport {
  const hasCorrectZIndex = /zIndex:\s*scenes\.length\s*-\s*1\s*-\s*i/.test(content);
  const hasWrongZIndex = /zIndex:\s*i[,}]/.test(content);

  return {
    defectId: 'REACT-004',
    filePath: 'app/designanimations/components/SceneGrid.tsx',
    description:
      'SceneGrid must assign descending z-indexes so earlier slides remain on top: zIndex: scenes.length - 1 - i.',
    severity: 'critical',
    passed: hasCorrectZIndex || !hasWrongZIndex,
    details: hasWrongZIndex ? 'Found zIndex: i, should be zIndex: scenes.length - 1 - i.' : undefined,
  };
}

function fixSceneGrid(content: string): string {
  return content.replace(/zIndex:\s*i/g, 'zIndex: scenes.length - 1 - i');
}

/* ── Public API ───────────────────────────────────────── */

export function verifyAll(): DefectReport[] {
  const reports: DefectReport[] = [];

  // 1. HTML
  const html = readFile('components/designanimations/DesignAnimations.html');
  if (html !== null) {
    reports.push(verifyHtmlDoctype(html));
  } else {
    reports.push({
      defectId: 'HTML-001',
      filePath: 'components/designanimations/DesignAnimations.html',
      description: 'HTML artifact not found.',
      severity: 'critical',
      passed: false,
    });
  }

  // 2. DesignDeckInteractive
  const ddi = readFile('app/designanimations/DesignDeckInteractive.tsx');
  if (ddi !== null) {
    reports.push(verifyDesignDeckInteractive(ddi));
  }

  // 3. use3DTilt
  const tilt = readFile('app/designanimations/hooks/use3DTilt.ts');
  if (tilt !== null) {
    reports.push(verifyUse3DTilt(tilt));
  }

  // 4. SceneGrid
  const grid = readFile('app/designanimations/components/SceneGrid.tsx');
  if (grid !== null) {
    reports.push(verifySceneGrid(grid));
  }

  return reports;
}

export function applyFixes(): HealResult {
  const reports = verifyAll();
  const appliedFixes: string[] = [];
  const failedFixes: string[] = [];

  const html = readFile('components/designanimations/DesignAnimations.html');
  if (html !== null && !reports.find((r) => r.defectId === 'HTML-001')?.passed) {
    try {
      writeFile('components/designanimations/DesignAnimations.html', fixHtmlDoctype(html));
      appliedFixes.push('HTML-001');
    } catch {
      failedFixes.push('HTML-001');
    }
  }

  const ddi = readFile('app/designanimations/DesignDeckInteractive.tsx');
  if (ddi !== null && !reports.find((r) => r.defectId === 'REACT-002')?.passed) {
    try {
      writeFile('app/designanimations/DesignDeckInteractive.tsx', fixDesignDeckInteractive(ddi));
      appliedFixes.push('REACT-002');
    } catch {
      failedFixes.push('REACT-002');
    }
  }

  const tilt = readFile('app/designanimations/hooks/use3DTilt.ts');
  if (tilt !== null && !reports.find((r) => r.defectId === 'REACT-003')?.passed) {
    try {
      writeFile('app/designanimations/hooks/use3DTilt.ts', fixUse3DTilt(tilt));
      appliedFixes.push('REACT-003');
    } catch {
      failedFixes.push('REACT-003');
    }
  }

  const grid = readFile('app/designanimations/components/SceneGrid.tsx');
  if (grid !== null && !reports.find((r) => r.defectId === 'REACT-004')?.passed) {
    try {
      writeFile('app/designanimations/components/SceneGrid.tsx', fixSceneGrid(grid));
      appliedFixes.push('REACT-004');
    } catch {
      failedFixes.push('REACT-004');
    }
  }

  // Re-verify after fixes
  const postReports = verifyAll();

  return {
    reports: postReports,
    appliedFixes,
    failedFixes,
  };
}
