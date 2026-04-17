---
name: 3ds-web-dev
description: Build web experiences for the Nintendo 3DS browser. Use this skill whenever the user wants to create websites, apps, or interactive experiences that work on the Nintendo 3DS browser, including optimizing for its hardware limitations, outdated WebKit engine, input controls (D-Pad, face buttons, touch), or legacy web standards. Also use for 3DS homebrew web apps, retro mobile web development, or understanding browser constraints of older hardware.
compatibility: Created for Zo Computer
metadata:
  author: etok.zo.computer
---

# 3DS Web Development

The Nintendo 3DS browser is a unique platform with significant constraints. This skill helps you build web experiences that work on this legacy hardware.

## Hardware Overview

| Spec | Old 3DS | New 3DS |
|------|---------|---------|
| CPU | 268 MHz ARM11 | 804 MHz ARM11 (dual-core) |
| RAM | 128 MB (shared) | 256 MB (shared) |
| Screen | 400x240 (top), 320x240 (bottom) | Same |

## Browser Limitations

- **Engine**: Old WebKit (based on NetFront NX)
- **Standards**: HTML4-level HTML, CSS2.1-level CSS, ES3 JavaScript
- **No ES6+**: No arrow functions, const/let, template literals, destructuring, classes, modules, Promises, async/await, etc.
- **No WebGL**: 3D hardware acceleration unavailable
- **No Geolocation API**
- **No WebSocket**: Use `XMLHttpRequest` (XHR) long-polling instead
- **No Web Workers**: All processing blocks the main thread
- **Limited Storage**: `localStorage` is volatile (erased on power off), unreliable for persistence
- **Poor media codec support**: Limited audio (AAC only) and no H.264 video in browser

## Input Controls

### Confirmed Working Input Methods

#### Keyboard Events (D-Pad & A Button)
The D-Pad and A button dispatch standard `keydown`/`keyup` events with `e.keyCode`:[^1][^2]

| Button | KeyCode | Key | `preventDefault` |
|--------|---------|-----|------------------|
| D-Pad Up | 38 | ArrowUp | ✅ Works |
| D-Pad Down | 40 | ArrowDown | ✅ Works |
| D-Pad Left | 37 | ArrowLeft | ✅ Works |
| D-Pad Right | 39 | ArrowRight | ✅ Works |
| A | 13 | Enter | ✅ Works |

```javascript
document.addEventListener('keydown', function(e) {
    e.preventDefault(); // stops default browser behavior
    switch(e.keyCode) {
        case 38: /* up */    break;
        case 40: /* down */  break;
        case 37: /* left */  break;
        case 39: /* right */ break;
        case 13: /* A */     break;
    }
});
document.addEventListener('keyup', function(e) {
    e.preventDefault();
    // handle release
});
```

#### Touch Screen
- Bottom screen acts as a touch input device
- Fires standard `touchstart`, `touchmove`, `touchend` events
- Also fires `mousedown`/`mousemove`/`mouseup` when tapping
- Use `e.touches[0].clientX` and `clientY` for coordinates

### Unavailable / Unreliable Input

| Button | Behavior |
|--------|----------|
| B | Unmapped / no known event |
| X | Browser zoom out (fires `resize`) |
| Y | Browser zoom in (fires `resize`) |
| L | Browser back (history) — may be hookable via `history.pushState` |
| R | Browser forward (history) — may be hookable via `history.pushState` |
| Start/Select | Browser toolbar toggle |
| ZL/ZR | Not intercepted |

**Gamepad API (`navigator.webkitGetGamepads`)**: Does NOT return button states on real hardware. Do not rely on it.[^1]

### Button Conflicts with Browser
Most buttons are **hijacked by browser behavior** and cannot be used freely.[^1]

**Safely usable for games:** Only **Up, Down, Left, Right, A, and touch** can be used without browser interference.

## Development Philosophy

### Server-Side Everything
100% of business logic and HTML generation should happen on the server. The 3DS browser is a terminal, not a compute platform.

**Recommended stacks:**
- Node.js + Express
- PHP
- Python + Flask/FastAPI

### Form Persistence Over LocalStorage
`localStorage` is unreliable and volatile on the 3DS. Use standard `<form>` submissions with server-side sessions or cookies for persistence.

### Use AJAX Sparingly
- Reserve AJAX for small UI updates
- Default to full page submissions for state changes
- Keep payloads minimal

### Input Handling
Use keyboard events for D-Pad and A button. Use `preventDefault()` to stop browser defaults.

```javascript
// Keyboard input for 3DS D-Pad + A
var keys = {38:'up', 40:'down', 37:'left', 39:'right', 13:'a'};
var state = {};
document.addEventListener('keydown', function(e) {
    var k = keys[e.keyCode];
    if (k) {
        e.preventDefault();
        state[k] = true;
        // handle press
    }
});
document.addEventListener('keyup', function(e) {
    var k = keys[e.keyCode];
    if (k) {
        e.preventDefault();
        state[k] = false;
        // handle release
    }
});
```

## Constraints

### RAM
Large canvas buffers or multiple canvases will quickly trigger **Page too large** errors or crashes. Keep canvases small (max ~400x240).

### No WebGL
3D hardware acceleration is not available in the browser. Use 2D canvas primitives only.

### Performance
Heavy pixel manipulation (`getImageData`) and complex physics will run at ~1-2 FPS. Optimize loops, minimize DOM manipulation, and avoid layout thrashing.

## Canvas

- **Maximum size:** 400x240 pixels (top screen), 320x240 (bottom)
- Only 2D context available
- Use `requestAnimationFrame` sparingly; prefer event-driven rendering
- Offscreen canvas not supported

## CSS Constraints

- Vendor prefix everything: `-webkit-`, `-moz-`, `-o-`, `-ms-`
- Test layouts on actual hardware or accurate emulator
- Keep selectors simple and avoid complex combinators

## Getting Started

When the user wants to build a 3DS web project:

1. Ask about their target experience (simple page, interactive app, game)
2. Recommend server-side stack based on their preference (Node, PHP, Python)
3. Help structure the project for server-rendered HTML
4. Use keyboard events for D-Pad/A input + touch events for the touchscreen
5. Test and verify on actual hardware or emulator

## Examples

- `/examples/debug.html` — Input tester showing all button codes via polling

---

[^1]: https://www.reddit.com/r/3DS/comments/4umrwj/using_the_3ds_controls_to_build_games_for_the_3ds/
[^2]: https://github.com/jwarby/3ds-to-pc-controller