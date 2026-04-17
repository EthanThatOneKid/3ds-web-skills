---
name: 3ds-web-dev
description: Build web experiences for the Nintendo 3DS browser. Use this skill whenever the user wants to create websites, apps, or interactive experiences that work on the Nintendo 3DS browser, including optimizing for its hardware limitations, outdated WebKit engine, input controls (D-Pad, face buttons, touch), or legacy web standards. Also use for 3DS homebrew web apps, retro mobile web development, or understanding browser constraints of older hardware.
compatibility: Created for Zo Computer
metadata:
  author: etok.zo.computer
---

# 3DS Web Development

The Nintendo 3DS browser is a unique platform with significant constraints. This skill helps you build web experiences that work within its limitations.

## Hardware Constraints

| Model | CPU | RAM |
|-------|-----|-----|
| Old 3DS | 268 MHz ARM11 | 128 MB |
| New 3DS | 804 MHz ARM11 | 256 MB |

Always design for the Old 3DS as baseline — it has ~10x less power than a modern smartphone.

## Browser Limitations

- **Engine**: Older WebKit (~iOS 5 era)
- **JavaScript**: No ES6+, no arrow functions, no Promises, no async/await
- **CSS**: Limited, no flexbox/grid, basic animations only
- **Canvas**: 2D support (Partial), No WebGL
- **Storage**: LocalStorage is volatile (cleared on browser restart)

## Development Philosophy

### Hybrid Architecture
Use a balanced approach between client-side interactivity and server-side state:
- **Interactivity**: Use "Old JS" (ES5) for UI toggles, animations, and immediate feedback.
- **Persistence**: Use SSR for data that must survive browser restarts (LocalStorage is volatile).
- **ES5 Only**: No ES6+, no arrow functions, no template literals, no `let`/`const`, no Promises.

### State Persistence
Since LocalStorage is unreliable (cleared on exit):
- Use standard `<form>` submissions for critical data changes.
- Use Server-side sessions or a database for long-term state.
- Use AJAX to enhance the UI without requiring full page reloads for every interaction.

### Form Handling
```html
<form action="/submit" method="POST">
  <input type="text" name="item">
  <button type="submit">Add</button>
</form>
```

### AJAX and Interactivity
Use JavaScript to make the page feel responsive. For example, toggle a menu or show a loading indicator immediately, even if the final state is saved on the server.

## Input Handling

The 3DS has unique input methods:

### D-Pad and Buttons
```javascript
document.addEventListener('keydown', function(e) {
    var display = document.getElementById('display');
    switch(e.keyCode) {
        case 13: display.innerText = "Button: A"; break;
        case 27: display.innerText = "Button: B (Esc)"; break;
        case 37: display.innerText = "D-Pad: Left"; break;
        case 38: display.innerText = "D-Pad: Up"; break;
        case 39: display.innerText = "D-Pad: Right"; break;
        case 40: display.innerText = "D-Pad: Down"; break;
    }
});
```

### Touch Screen
- Single touch only
- Avoid multi-touch gestures
- Large tap targets (minimum 44px)

## Canvas API

The 3DS supports the HTML5 Canvas 2D API, but it is highly constrained by the system's limited RAM (128MB shared).

### Screen Resolutions
- **Top Screen**: 400x240 pixels.
- **Bottom Screen**: 320x240 pixels.

### Constraints
- **RAM**: Large canvas buffers or multiple canvases will quickly trigger "Page too large" errors or crashes. Keep canvases small.
- **No WebGL**: 3D hardware acceleration is not available in the browser. Use 2D primitives only.
- **Performance**: Heavy pixel manipulation (`getImageData`) and complex paths are slow. Aim for ~15 FPS.

### Optimization Tips
1. **Minimize Redraws**: Only redraw parts of the canvas that change using `clearRect()`.
2. **Simple Shapes**: Use `fillRect()` and `strokeRect()` instead of complex paths where possible.
3. **Alpha Blending**: Avoid heavy use of transparency/globalAlpha as it taxes the CPU.

**Example: Simple Canvas Animation (ES5)**
```javascript
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var x = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x, 50, 20, 20); // Draw square
    x = (x + 2) % canvas.width;
    setTimeout(draw, 66); // ~15 FPS
}
draw();
```

## Best Practices

1. **Keep it simple** — Minimal JavaScript, maximum server rendering
2. **Optimize images** — Small file sizes, use appropriate formats
3. **Test on device** — Emulators aren't perfect
4. **Offline support** — Consider what works without internet
5. **Consider the screen** — 400x240 resolution, ~15 fps for animations

## Project Structure

```
my-3ds-site/
├── server.js          # Express/Node server
├── views/
│   ├── index.ejs      # Server-rendered template
│   └── todo.ejs
├── public/
│   ├── style.css
│   └── script.js      # Minimal client JS
└── package.json
```

**Example: Hybrid To-Do List**

**Server (Express):**
```javascript
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var todos = []; // Simple in-memory storage

app.get('/', function(req, res) {
  res.render('index', { todos: todos });
});

app.post('/add', function(req, res) {
  if (req.body.item) {
    todos.push(req.body.item);
  }
  res.redirect('/');
});
```

**Template (EJS):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>3DS To-Do</title>
  <style>
    .loading { display: none; color: gray; }
  </style>
</head>
<body>
  <h1>To-Do</h1>
  <ul id="todo-list">
    <% for(var i=0; i<todos.length; i++) { %>
      <li><%= todos[i] %></li>
    <% } %>
  </ul>

  <div id="status" class="loading">Saving...</div>

  <form action="/add" method="POST" onsubmit="showLoading()">
    <input type="text" name="item" id="item-input">
    <button type="submit">Add</button>
  </form>

  <script>
    // "Old JS" for immediate feedback
    function showLoading() {
      document.getElementById('status').style.display = 'block';
      // Local check before sending
      var input = document.getElementById('item-input');
      if (input.value === '') {
        alert('Please enter an item');
        return false;
      }
      return true;
    }
  </script>
</body>
</html>
```

## Getting Started

When the user wants to build a 3DS web project:
1. Ask about their target experience (simple page, interactive app, game)
2. Recommend server-side stack based on their preference (Node, PHP, Python)
3. Help structure the project for server-rendered HTML
4. Guide on input handling patterns
5. Test and optimize for 3DS constraints
