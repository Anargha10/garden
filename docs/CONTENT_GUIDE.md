# Content Guide - Gift App Assets

This guide explains where to place all visual assets for the Gift romantic storytelling app.

## Directory Structure

```
public/
├── memories/       # Polaroid photo memories
├── flowers/        # Transparent PNG flower images
└── textures/       # Background textures and patterns
```

---

## Memory Photos (`public/memories/`)

Place polaroid-style photos here for the Memories scene (Scene03).

### Specifications
- **Format**: JPG or WebP (JPG recommended)
- **Dimensions**: 800×1000px (4:5 portrait ratio)
- **Maximum file size**: 200KB per image
- **Naming convention**: `01.jpg` through `10.jpg`

### Notes
- Photos should have a warm, nostalgic feel
- Slight vignette or film grain effect works well
- Avoid heavily saturated or modern-filtered images
- Aspect ratio is critical — polaroids display at fixed 4:5

---

## Flower PNGs (`public/flowers/`)

Transparent PNG flower images for the Bouquet scene (Scene06).

### Specifications
- **Format**: PNG with transparency
- **Dimensions**: 400×500px recommended
- **Maximum file size**: 100KB per image
- **Naming convention**: `{flower-name}.png` (kebab-case)

### Required Flowers
| Filename | Flower Type | Size Role |
|----------|-------------|-----------|
| `rose.png` | Rose | Small accent |
| `sunflower.png` | Sunflower | Large backdrop |
| `peony.png` | Peony | Large backdrop |
| `tulip.png` | Tulip | Small accent |
| `lily.png` | Lily | Large backdrop |
| `baby-breath.png` | Baby's Breath | Small accent |

### PNG Requirements
- **Transparent background** — no white or colored background
- **Soft edges** — feathered or natural cutout, not hard paths
- **Consistent lighting** — all flowers should have similar lighting direction
- **Romantic color palette** — soft, warm tones recommended

### Fallback
If a PNG is missing, the app displays a graceful CSS gradient flower shape. Ensure at least the large backdrop flowers exist for the best experience.

---

## Textures (`public/textures/`)

Background textures and decorative elements.

### Specifications
- **Format**: PNG, JPG, or WebP
- **Dimensions**: Variable (typically 1000×1000px or larger for tiling)
- **Maximum file size**: 500KB per texture

### Common Textures
- `parchment.jpg` — Aged paper background
- `noise.png` — Subtle grain overlay
- `vignette.png` — Dark edges overlay

---

## Quick Checklist Before Deployment

- [ ] 10 memory photos in `public/memories/` (01.jpg through 10.jpg)
- [ ] 6 flower PNGs in `public/flowers/` with transparent backgrounds
- [ ] Any background textures in `public/textures/`
- [ ] All files under recommended size limits
- [ ] Tested that app gracefully handles missing images

---

## Asset Credits

All assets should be either:
- Original creations
- Licensed for commercial/personal use
- Public domain

Do not use copyrighted images without proper licensing.