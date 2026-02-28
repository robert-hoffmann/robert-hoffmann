# Optimizations

This page covers performance patterns used in the parallax engine and a reference pipeline for image optimization.

## Runtime Performance

### GPU-Accelerated Transforms

All per-frame visual updates use `transform` (`translate3d`, `scale`) and `perspective` — properties that trigger only the **composite** phase of the rendering pipeline, bypassing layout and paint. This is the most efficient way to animate in browsers.

### requestAnimationFrame Loop

The engine uses a single `requestAnimationFrame` loop that calculates all container and layer transforms in one pass. This consolidates all DOM writes into one frame callback, avoiding layout thrashing.

### Lerp Smoothing

Rather than snapping to target values, all position and scale values are interpolated:

```
current = current + (target - current) × lerp
```

This produces smooth motion while spreading computation evenly across frames. Lower lerp values (slower motion) also reduce the visual impact of any single dropped frame.

### will-change

The parallax container and layers use `will-change: transform` to hint the browser's compositor that these elements will be animated, allowing it to promote them to their own GPU layers ahead of time.

### FPS Monitoring

The engine calculates FPS every 500ms by counting `requestAnimationFrame` callbacks. The `FpsBadge` component displays this with color coding:

| Color   | FPS    | Status             |
| ------- | ------ | ------------------ |
| Green   | ≥ 55   | Smooth             |
| Amber   | 30–54  | Moderate           |
| Rose    | < 30   | Needs attention    |

### Frozen Mode

In tune mode, the engine resets all transforms to zero. The rAF loop still runs but applies identity transforms, keeping the loop warm while freeing the GPU from animation work.

## Image Optimization Reference

This section documents a reference pipeline for optimizing the sample parallax layer images. It uses [Sharp](https://sharp.pixelplumbing.com/) (already installed as a dev dependency).

### Source Files

| File               | Size     | Usage                                  |
| ------------------ | -------- | -------------------------------------- |
| `background.png`   | ~3.8 MB  | Sky/clouds layer                       |
| `middle.png`       | ~1.6 MB  | Floating rocks layer                   |
| `foreground.png`   | ~4.3 MB  | Man + tree on cliff layer              |


### Output Strategy

- **Delivery cap**: 1920px max width
- **Breakpoints**: 960w (mobile), 1280w (tablet), 1920w (desktop)
- **Formats**: AVIF (primary) + WebP (fallback)
- PNG kept only as source master, not shipped to users

### Quality Presets

| Layer        | AVIF Quality | WebP Quality | Alpha Quality | Subsampling |
| ------------ | ------------ | ------------ | ------------- | ----------- |
| background   | 45           | 68           | 100           | 4:2:0       |
| middle       | 50           | 72           | 90            | 4:4:4       |
| foreground   | 55           | 78           | 95            | 4:4:4       |

Use `effort: 6` for both formats.

### CSS Delivery

Use `image-set()` with media queries to serve the right breakpoint:

```css
.layer-bg {
  /* Fallback */
  background-image: url("assets/optimized/background/1920/background.webp");
  /* Modern browsers */
  background-image: image-set(
    url("assets/optimized/background/1920/background.avif") type("image/avif"),
    url("assets/optimized/background/1920/background.webp") type("image/webp")
  );
}

@media (max-width: 1280px) {
  .layer-bg {
    background-image: url("assets/optimized/background/1280/background.webp");
    background-image: image-set(
      url("assets/optimized/background/1280/background.avif") type("image/avif"),
      url("assets/optimized/background/1280/background.webp") type("image/webp")
    );
  }
}

@media (max-width: 768px) {
  .layer-bg {
    background-image: url("assets/optimized/background/960/background.webp");
    background-image: image-set(
      url("assets/optimized/background/960/background.avif") type("image/avif"),
      url("assets/optimized/background/960/background.webp") type("image/webp")
    );
  }
}
```

### Browser Support

- `image-set()` (unprefixed): Chrome 113+, Firefox 89+, Safari 17+
- `-webkit-image-set()`: Safari 14–16, older Chrome
- Always include a plain `background-image` fallback before `image-set()` for legacy browsers

### Preloading

Preload only the background layer (Largest Contentful Paint candidate):

```html
<link rel="preload" as="image" type="image/avif"
      href="assets/optimized/background/1920/background.avif">
```

Don't preload middle/foreground — the browser fetches them soon enough.

### Performance Targets

| Metric                | Target                    |
| --------------------- | ------------------------- |
| Total image transfer  | < 2 MB (desktop), < 800 KB (mobile) |
| Largest Contentful Paint | < 2.5s on 4G          |
| Frame stability       | ≥ 55 fps during parallax |

### Runtime Recommendations

- Keep parallax transforms on `transform` only — no layout-triggering properties
- Disable or reduce parallax intensity on low-end/mobile if needed
- The container's `perspective` is set every frame — this is a cheap style write but could be set once at init + on config change for marginal savings
