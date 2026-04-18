---
name: 3ds-web-dev
description: Build web experiences for the Nintendo 3DS browser. Use this skill whenever the user wants to create websites, apps, or interactive experiences that work on the Nintendo 3DS browser, including optimizing for its hardware limitations, outdated WebKit engine, input controls (D-Pad, face buttons, touch), or legacy web standards. Also use for 3DS homebrew web apps, retro mobile web development, or understanding browser constraints of older hardware.
compatibility: Created for Zo Computer
metadata:
  author: etok.zo.computer
---

# 3DS Web Development

Developing for the Nintendo 3DS browser requires a "retro-forward" mindset. Because the hardware uses a legacy WebKit-based engine (NetFront NX), modern web features are unavailable.

> **Official Browser Specs:** https://archive.today/8qs51

---

## Hardware Overview

| Spec | Old 3DS | New 3DS |
|------|---------|---------|
| CPU | 268 MHz ARM11 | 804 MHz ARM11 (dual-core) |
| RAM | 128 MB (shared) | 256 MB (shared) |
| Screen | 400×240 (top), 320×240 (bottom) | Same |

## Browser Engines

| | Original 3DS | New 3DS |
|--|---------------|---------|
| **Engine** | Netfront Browser | Netfront Browser NX v3.0 |
| **User Agent** | `Mozilla/5.0 (Nintendo 3DS; U: en) Version/1.7498 US` | `Mozilla/5.0 (New Nintendo 3DS like iPhone) AppleWebKit/536.30 (KHTML, like Gecko) NX` |

## Web Standards Support

| Feature | Original 3DS | New 3DS |
|---------|-------------|---------|
| HTML | HTML 4.01, XHTML 1.1 | HTML 4.01, **HTML 5**, XHTML 1.1 |
| CSS | CSS 1, CSS 2.1, CSS 3 (partial) | CSS 1, CSS 2.1, CSS 3 (partial) |
| JavaScript | ES (XMLHttpRequest, Canvas) | ES, **WebSocket**, **Gamepad API**, **Web Storage**, Canvas, Video, Web Messaging, Server-Sent Events, WOFF |
| SVG | No | **Yes** |
| WebSocket | No | **Yes** |
| Web Workers | No | No |
| WebGL | No | No |
| Geolocation | No | No |

## Media Support

| Media | Original 3DS | New 3DS |
|-------|-------------|---------|
| **Audio Codecs** | None listed | **AAC**, **MP3** |
| **Video Codecs** | None listed | H.264 MPEG-4 AVC (max 854×480 @ level 3.2), **MP4**, **M3U8+TS (HLS)** |
| **Image Formats** | MPO, GIF, JPEG, PNG, BMP, ICO | BMP, GIF, ICO, JPEG, PNG, **SVG**, MPO, JPEG (preview only) |
| **Plugins** | None | None |

> ⚠️ **Audio note:** Web Audio API (oscillators, nodes, etc.) is not available on either model. On New 3DS, use pre-encoded AAC or MP3 files via `<audio>` or the `Audio()` API. On Original 3DS, audio playback in the browser is not officially supported.

---

## Input Controls

The browser hijacks most physical buttons for navigation. Only a subset of inputs can be intercepted by web applications via standard event listeners.

### Interceptable Inputs (Safe for Use)

Use `e.preventDefault()` to suppress default browser scrolling or focal jumping.

| Input | KeyCode | Event Property | Browser Default |
|-------|---------|----------------|-----------------|
| **D-Pad Up** | 38 | ArrowUp | Scroll Up |
| **D-Pad Down** | 40 | ArrowDown | Scroll Down |
| **D-Pad Left** | 37 | ArrowLeft | Scroll Left |
| **D-Pad Right** | 39 | ArrowRight | Scroll Right |
| **A Button** | 13 | Enter | Click/Submit |
| **Touchscreen** | N/A | `touchstart` | Mouse Click |

#### Touch Screen
- Bottom screen acts as a touch input device
- Fires standard `touchstart`, `touchmove`, `touchend` events
- Also fires `mousedown`/`mousemove`/`mouseup` when tapping
- Use `e.touches[0].clientX` and `e.touches[0].clientY` for coordinates

### Reserved Inputs (Avoid)

| Input | Browser Default / Conflict |
|-------|----------------------------|
| **X / Y** | Handle browser zoom levels (fires `resize`). |
| **L / R** | Navigate Page History (Back/Forward). |
| **Start / Select** | Toggles browser UI/Toolbar. |
| **B Button** | Unmapped / no known event |
| **ZL / ZR** | Native system functions; not intercepted. |

> **Gamepad API** (`navigator.webkitGetGamepads`): Does NOT return button states on real hardware (Old 3DS). On New 3DS, Gamepad API is listed as supported but may be unreliable. Do not rely on it for critical input.

### Button Conflicts with Browser
Most buttons are **hijacked by browser behavior** and cannot be used freely.

**Safely usable for games:** Only **Up, Down, Left, Right, A, and touch** can be used without browser interference.

---

## Input Handler Example

```javascript
// Robust ES3-compatible input listener for games/apps
var inputState = { up: false, down: false, left: false, right: false, a: false };
var keyMap = { 38: 'up', 40: 'down', 37: 'left', 39: 'right', 13: 'a' };

function handleKey(e, isDown) {
    var action = keyMap[e.keyCode];
    if (action) {
        e.preventDefault();
        inputState[action] = isDown;
    }
}

document.addEventListener('keydown', function(e) { handleKey(e, true); }, false);
document.addEventListener('keyup', function(e) { handleKey(e, false); }, false);
```

---

## Development Philosophy & Best Practices

1. **Server-Side Everything:** 100% of business logic and HTML generation should happen on the server. The 3DS browser is a terminal, not a compute platform.
   - Recommended stacks: Node.js + Express, PHP, Python + Flask/FastAPI
2. **Form Persistence Over LocalStorage:** `localStorage` is volatile and often cleared on power-off. Use standard `<form>` submissions with server-side sessions or cookies for persistence.
3. **Use AJAX Sparingly:** Reserve AJAX for small UI updates. Default to full page submissions for state changes.
4. **Memory Management:** Large images or multiple `<canvas>` elements will trigger "Page too large" errors. Keep assets small.
5. **UI/UX for Dual Screens:** Design for a vertical flow. Remember the bottom screen is the only touch-sensitive area.

### Audio on New 3DS

Use HTML5 `<audio>` or `Audio()` API with AAC or MP3 files. Web Audio API (oscillators, etc.) is not supported.

```html
<audio src="chiptune.mp3" autoplay></audio>
```
or
```javascript
new Audio('chiptune.mp3').play();
```

---

## Technical Constraints

### Hardware Limits
- **RAM:** Large canvas buffers or multiple canvases will quickly trigger **Page too large** errors or crashes.
- **Performance:** Heavy pixel manipulation (`getImageData`) and complex physics will run at ~1–2 FPS.

### Canvas Specifications
- **Maximum size:** 400×240 pixels (top screen), 320×240 (bottom)
- **Context:** Only 2D context available
- **Optimization:** Use `requestAnimationFrame` sparingly; prefer event-driven rendering. Offscreen canvas not supported.

### CSS Strategy
- **Vendor Prefixes:** Prefix everything: `-webkit-`, `-moz-`, `-o-`, `-ms-`
- **Layout:** Keep selectors simple and avoid complex combinators to prevent performance hits during reflow.

---

## Getting Started

When building a 3DS web project:

1. **Identify the Experience:** Simple page, interactive app, or 2D game.
2. **Choose a Stack:** Select your architecture based on persistence needs. Use client-side JS + Cookies for local tools; use a server-side stack (Node, PHP, Python) for shared state or heavy data processing.
3. **Input Setup:** Use keyboard events for D-Pad/A input + touch events for the touchscreen.
4. **Audio:** For audio on New 3DS, use AAC or MP3 via `<audio>` element.
5. **Verification:** Test and verify on actual hardware or an accurate emulator.

---

## Examples

- `/examples/debug.html` — Input tester showing all button codes via polling

[^1]: https://www.reddit.com/r/3DS/comments/4umrwj/using_the_3ds_controls_to_build_games_for_the_3ds/
[^2]: https://github.com/jwarby/3ds-to-pc-controller
