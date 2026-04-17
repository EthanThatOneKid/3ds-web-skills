---
name: 3ds-web-dev
description: Specialized skill for building web experiences optimized for the Nintendo 3DS browser (NetFront NX). Focuses on hardware constraints (limited RAM/CPU), legacy standards (ES3/CSS2.1), physical input mapping (D-Pad, A button, touch), and server-side heavy architectures. Use this when creating sites, apps, or games for the 3DS or understanding legacy browser constraints.
compatibility: Created for Zo Computer
metadata:
  author: etok.zo.computer
---

# 3DS Web Development

Developing for the Nintendo 3DS browser requires a "retro-forward" mindset. Because the hardware uses a legacy WebKit-based engine (NetFront NX), modern web features are unavailable. This guide outlines the technical specifications and constraints for building functional 3DS web applications.

---

## Hardware Specifications

| Component | Old 3DS / 2DS | New 3DS / 2DS XL |
| :--- | :--- | :--- |
| **CPU** | 268 MHz ARM11 | 804 MHz ARM11 (Dual-Core) |
| **RAM** | 128 MB (Shared) | 256 MB (Shared) |
| **Top Screen** | 400x240 px | 400x240 px |
| **Bottom Screen** | 320x240 px (Resistive Touch) | 320x240 px (Resistive Touch) |

---

## Browser Capabilities & Limitations

The 3DS browser is highly restrictive. To ensure stability, adhere to the following technical constraints:

*   **JavaScript Engine:** Supports **ECMAScript 3 (ES3)** only.
    *   *Unsupported:* `let`, `const`, arrow functions, template literals, Promises, `async/await`, or Classes.
*   **CSS Standards:** Primarily **CSS 2.1**. Limited support for CSS3 (requires `-webkit-` prefixes).
*   **Networking:** No WebSockets. Use `XMLHttpRequest` (XHR) with long-polling for "real-time" data.
*   **Storage:** `localStorage` is volatile and often cleared on power-off. Use server-side sessions or cookies for persistence.
*   **Graphics:** No WebGL support. Canvas is limited to 2D context only.
*   **Concurrency:** No Web Workers; all JavaScript execution is single-threaded and blocks the UI.
*   **Media:** Poor codec support (Limited audio/AAC; no H.264 video in-browser).
*   **APIs:** No Geolocation API, No Web Audio API.

---

## Input Mapping & Controls

The browser hijacks most physical buttons for navigation. Only a subset of inputs can be intercepted by web applications via standard event listeners.

### Interceptable Inputs (Safe for Use)
Use `e.preventDefault()` to suppress default browser scrolling or focal jumping.

| Input | KeyCode | Event Property | Browser Default |
| :--- | :--- | :--- | :--- |
| **D-Pad Up** | 38 | `ArrowUp` | Scroll Up |
| **D-Pad Down** | 40 | `ArrowDown` | Scroll Down |
| **D-Pad Left** | 37 | `ArrowLeft` | Scroll Left |
| **D-Pad Right** | 39 | `ArrowRight` | Scroll Right |
| **A Button** | 13 | `Enter` | Click/Submit |
| **Touchscreen** | N/A | `touchstart` | Mouse Click |

### Reserved Inputs (Avoid)
Most other buttons are **hijacked by browser behavior** and cannot be used reliably.[^1]

| Input | Browser Default / Conflict |
| :--- | :--- |
| **X / Y** | Handle browser zoom levels (fires `resize`). |
| **L / R** | Navigate Page History (Back/Forward). |
| **Start / Select** | Toggles browser UI/Toolbar. |
| **B Button** | Generally unmapped or used for "Back" in system menus. |
| **ZL / ZR** | Native system functions; not intercepted. |

> [!IMPORTANT]
> The **Gamepad API** (`navigator.webkitGetGamepads`) does not return button states on retail hardware. You must rely on Keyboard Events for physical button input.

---

## Implementation Example: Input Handler

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

1.  **Server-Side Heavy Architecture:** Treat the 3DS as a thin client. Use Node.js, PHP, or Python to handle logic and render HTML. Default to full-page submissions for state changes.
2.  **Memory Management:** Large images or multiple `<canvas>` elements will trigger "Page too large" errors. Keep assets small and optimize memory usage.
3.  **UI/UX for Dual Screens:** Design for a vertical flow. Remember the bottom screen is the only touch-sensitive area.
4.  **Graceful Degradation:** Use feature detection. If a script fails due to ES3 incompatibility, the site should remain navigable via standard HTML links.

---

## Technical Constraints & Canvas

### Hardware Limits
*   **RAM:** Large canvas buffers or multiple canvases will quickly trigger **Page too large** errors or crashes.
*   **Performance:** Heavy pixel manipulation (`getImageData`) and complex physics will run at ~1-2 FPS. Optimize loops and minimize DOM manipulation.

### Canvas Specifications
*   **Maximum size:** 400x240 pixels (top screen), 320x240 (bottom).
*   **Context:** Only 2D context available.
*   **Optimization:** Use `requestAnimationFrame` sparingly; prefer event-driven rendering. Offscreen canvas not supported.

### CSS Strategy
*   **Vendor Prefixes:** Prefix everything: `-webkit-`, `-moz-`, `-o-`, `-ms-`.
*   **Layout:** Keep selectors simple and avoid complex combinators to prevent performance hits during reflow.

---

## Workflow: Getting Started

When building a 3DS web project:

1.  **Identify the Experience:** Simple page, interactive app, or 2D game.
2.  **Choose a Stack:** Recommend a server-side stack (Node, PHP, Python) for robust state handling.
3.  **Input Setup:** Use keyboard events for D-Pad/A input + touch events for the touchscreen.
4.  **Verification:** Test and verify on actual hardware or an accurate emulator.

---

## Examples & References

*   `/examples/debug.html` — Input tester showing all button codes via polling.

[^1]: [Reddit: Using 3DS controls to build games](https://www.reddit.com/r/3DS/comments/4umrwj/using_the_3ds_controls_to_build_games_for_the_3ds/)
[^2]: [GitHub: 3DS to PC Controller Study](https://github.com/jwarby/3ds-to-pc-controller)