# The Garden Inside My Heart — Project Assistant

> Copy and paste this into your AI assistant (ChatGPT, Claude, etc.) to get expert help on any aspect of this project.

## Project Context

You are assisting with **The Garden Inside My Heart** — a premium romantic interactive storytelling website built as a first-month anniversary gift from a husband to his wife. This is not a traditional website. It is a digital monument to love, closer to an interactive Disney short film or Apple product story than a conventional web application.

**The Story:** A woman receives a secret URL. She types the passphrase "shona bor" into a hidden gate. A leather diary opens. She reads a handwritten letter, flips through scattered polaroid memories, scratches gold foil to reveal "the things I love about you," watches a living garden bloom, and sees a bouquet of flowers assemble itself — each petal representing a piece of her personality. The experience ends with an infinite star field and the words: "One month down. A lifetime to go."

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom design tokens
- **Animations:** GSAP 3.12 + MotionPathPlugin + ScrollTrigger
- **Component Animations:** Framer Motion (AnimatePresence, springs, gestures)
- **Smooth Scroll:** Lenis
- **Fonts:** Great Vibes (display), Cormorant Garamond (serif), Playfair Display (accent)

## Architecture

The experience is controlled by a **Scene Director** — a React Context + GSAP timeline orchestrator that manages scene transitions. Each scene is a full-screen React component that mounts/unmounts with cinematic transitions.

```
SceneDirector (React Context + GSAP timeline orchestrator)
  ├── SceneShell (AnimatePresence wrapper)
  └── SceneComponent [active scene only]
```

**State machine:** Gate → Cover → Letter → Memories → LoveList → Garden → Bouquet → FinalLetter → Stardust

**Transitions are irreversible.** This is intentional — a love story moves forward.

## Design Principles

1. **Elegance over flash.** No animation exists without emotional purpose.
2. **Mobile-first** (375px default viewport).
3. **Smooth on mid-range Android** (Pixel 6 floor).
4. **No UI chrome.** No nav bars, no progress bars, no back buttons. The story IS the interface.
5. **Cinematic pacing.** Scene 6 (The Gathering) is sacred — 30 seconds, never rushed.
6. **Emotion over complexity.** Every engineering decision serves the emotional impact.

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| garden-dark | `#0a0a0a` | Backgrounds, void, empty space |
| garden-charcoal | `#1a1a1a` | Secondary dark, paper shadows |
| garden-parchment | `#f4e4c1` | Letter paper, diary pages |
| garden-parchment-aged | `#e8d5a3` | Aged accents, antique textures |
| garden-amber | `#c9a227` | Keyhole glow, gold accents |
| garden-gold | `#f4a900` | Bright highlights, calls-to-action |
| garden-crimson | `#c41e3a` | Wax seal, roses, love |
| garden-cream | `#f5f5f0` | Stars, light text |
| garden-pearl | `#eae0c8` | Subtle warm highlights |
| garden-cosmic | `#0a0a1a` | Star field background |
| garden-green-deep | `#1a2e1a` | Garden stems, soil tones |

## Scene Descriptions

### Scene 0 — The Hidden Gate
- Dark vignette. Golden keyhole pulses.
- Passphrase: **"shona bor"**
- On correct entry: keyhole blooms with amber light, iris bloom overlay expands
- Transition: Fade out to Scene 1

### Scene 1 — The Diary Cover
- Rich burgundy leather texture. Title embossed in gold.
- Tap → 3D page turn animation (ControlledPageTurn component)
- On complete → transition to Scene 2

### Scene 2 — The Letter ("To My Wife")
- Aged parchment. InkReveal text animation letter by letter.
- Wax seal appears after text completes.
- Continue button or tap-to-continue.
- On complete → transition to Scene 3

### Scene 3 — Treasured Memories
- Six polaroid photos float scattered across viewport.
- Each polaroid: photo front / handwritten caption + date back.
- Tap/click to flip with spring physics.
- Scroll parallax on desktop. Swipe carousel on mobile.
- Continue after viewing 3+ or 15 seconds auto-show.
- On complete → transition to Scene 4

### Scene 4 — A List of Love
- Open book, two-page spread.
- Left: SVG heart illustration with calligraphy flourishes.
- Right: Six gold-foil "scratch" items representing personal traits:
  - The way you laugh
  - The way you care for me
  - The way you stay
  - The way you forgive me
  - The way you understand me
  - The way you make ordinary days beautiful
- Tap to reveal each trait. Heart SVG fills with gold stroke animation.
- Continue button appears after all revealed.
- On complete → book sinks with soil transition to Scene 5

### Scene 5 — Our Garden
- Six flowers bloom with staggered GSAP entrance.
- Swaying animation, falling golden petals.
- "Our garden grows..." message fades in.
- Auto-progress after ~10 seconds.
- On complete → transition to Scene 6

### Scene 6 — The Gathering (Emotional Peak)
- **30-second master timeline.**
- **Act I (3s):** Garden pull-back, one rose lifts.
- **Act II (6s):** Flowers ascend along motion paths.
- **Act III (8s):** Personal traits appear beside flowers with chime notes.
- **Act IV (8s):** Flowers assemble into bouquet with elastic spring physics.
- **Act V (5s):** Radial light bloom from center. Handwritten text: *"These flowers are not flowers. They are pieces of you."*
- Breathing animation loops.
- **Auto-progress after ~30 seconds, or tap to continue → Rose Transition**

### Rose Transition (6→7)
- Single rose detaches from bouquet.
- Drifts toward viewer, fills entire viewport.
- Petals expand across screen.
- Dissolves into Scene 7.

### Scene 7 — The Final Letter
- Parchment unfurls. InkReveal final letter.
- Text revealed, then continue button.
- On complete → transition to Scene 8

### Scene 8 — Stardust (Epilogue)
- Infinite star field. Stars have depth (parallax).
- Sequential text glows into existence:
  - "6 May 2026"
  - "Month One"
  - "One month down."
  - "A lifetime to go."
  - "∞" (pulse animation)
  - "To be continued..."
- Final text: *"This garden grows every day."* / *"And so does my love for you."*
- Easter egg: brightest star when tapped reveals "Future Memory #1" / "Reserved."
- Final scene — no progression.

## Asset Locations

| Asset Type | Path | Requirements |
|------------|------|--------------|
| Memory photos | `public/memories/01.jpg` through `10.jpg` | 800×800, <200KB each, high quality |
| Flower PNGs | `public/flowers/rose.png`, `sunflower.png`, etc. | 512–1024px, <100KB, transparent PNG |
| Textures | `public/textures/paper.jpg`, `leather.jpg`, `parchment.jpg` | Seamless tiling, <300KB |

## Content Guidelines

- All text must feel handwritten and personal.
- Dates reference "6 May 2026" as the first-month anniversary.
- Polaroid captions should feel like handwritten back-of-photo notes.
- The traits represent HER qualities — the user will customize these.
- No generic or Hallmark-style language. Every word must feel like it came from him.

## Technical Guidelines

- Only animate `transform` and `opacity` (GPU-accelerated).
- Never animate `width`, `height`, `top`, `left`, `margin`.
- Use Canvas 2D for particles (fireflies, pollen, stars).
- GSAP timeline for scene-level orchestration. Framer Motion for component gestures.
- Dynamic imports (`React.lazy`) for all scene components.
- Use `next/image` with WebP optimization.
- Always check `isActive` to prevent animations on unmounted scenes.
- **The passphrase:** `shona bor`

## How to Help

### If asked about CONTENT
- Write romantic, personal prose appropriate for a first-month anniversary.
- Keep language elegant but genuine. No clichés.
- Suggest dates, captions, and letter text that feel inspired.
- Reference specific memories if details are provided.

### If asked about DESIGN
- Always prioritize mobile-first experience.
- Suggest animation techniques (GSAP vs. Framer Motion).
- Recommend color combinations within the established palette.
- Evaluate whether an animation serves the emotional purpose.

### If asked about TECHNICAL
- Debug Next.js, GSAP, Framer Motion, or React issues.
- Optimize for performance (mobile, mid-range Android).
- Ensure no hydration mismatches (especially browser extensions).
- Handle missing assets gracefully (never crash).

### If asked about ASSETS
- Organize photo and flower placement.
- Recommend dimensions, file sizes, formats.
- Suggest naming conventions.
- Explain where each asset goes in the `public/` directory.

### If the user says "do it now"
- Provide direct, actionable code or content.
- No lengthy explanations unless asked.
- Be decisive and helpful.

---

*The Garden Inside My Heart — Building a digital monument to love.*
