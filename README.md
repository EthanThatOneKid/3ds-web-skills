# 3DS Web Skills

Web development skills for the Nintendo 3DS browser.

**Official Browser Specs:** https://archive.today/8qs51

**Live:** https://ethanthatonekid.github.io/3ds-web-skills/

## Examples

| File | Type | Description |
| :--- | :--- | :--- |
| [snake.html](./examples/snake.html) | Game | Classic snake with high score |
| [flappy-bird.html](./examples/flappy-bird.html) | Game | Flappy bird clone |
| [concentration.html](./examples/concentration.html) | Game | Memory matching game |
| [breakout.html](./examples/breakout.html) | Game | Paddle and brick breaker |
| [pong.html](./examples/pong.html) | Game | Single player vs CPU |
| [tetris.html](./examples/tetris.html) | Game | Block stacking game |
| [space-invaders.html](./examples/space-invaders.html) | Game | Space shooter |
| [calculator.html](./examples/calculator.html) | Utility | Integer calculator with D-Pad navigation |
| [stopwatch.html](./examples/stopwatch.html) | Utility | Timer with Pomodoro support |
| [touch-draw.html](./examples/touch-draw.html) | Utility | Canvas drawing with cookie persistence |
| [todo.html](./examples/todo.html) | Utility | Todo list with cookie storage |
| [debug.html](./examples/debug.html) | Demo | Input tester for D-Pad/A button |
| [adventure.html](./examples/adventure.html) | Demo | Text adventure with inventory |
| [pizza.html](./examples/pizza.html) | Demo | Interactive cartoon with dialog |
| [ascii-movie.html](./examples/ascii-movie.html) | Demo | Text-based animation |
| [spirograph.html](./examples/spirograph.html) | Demo | Procedural art generator |
| [chiptune.html](./examples/chiptune.html) | Demo | Audio player with visualizer |

## Development & testing workflow

### QR code testing
If you're on the home screen, pressing L or R will bring up the camera. There's a QR code button right there — scan a code containing a URL and your 3DS will offer to open it in the browser.

### Development workflow

#### Built-in developer tool (recommended)
This repository includes an interactive developer tool that starts a local server, opens a secure tunnel, and prints a scannable QR code directly inside your terminal!

1. Clone this repository:
   ```bash
   git clone https://github.com/EthanThatOneKid/3ds-web-skills.git
   cd 3ds-web-skills
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   # or: npm run dev
   ```
4. Scan the QR code generated in your terminal with your 3DS (press L/R on home screen) — changes are live as you code!

#### Custom local tunnel manual setup
If you prefer to configure your own tunneling service manually:

1. Start your local development server (e.g., `python -m http.server 8000`)
2. Create a tunnel to a temporary public URL:
   - ngrok: `ngrok http 8000`
   - Cloudflare: `cloudflared tunnel --url localhost:8000`
   - Tunnelmole: `npx tunnelmole 8000`
   - localtunnel: `npx localtunnel --port 8000`
3. Generate a QR code pointing to the tunnel URL (be sure to use the **`http://`** version instead of `https://` to avoid SSL/TLS error `032-1035` on the 3DS browser).
4. Scan and test on the 3DS.

#### Deploy to production
1. Deploy your site to a public URL (Vercel, Netlify, GitHub Pages, etc.)
2. Generate a QR code pointing to your URL (ensure `http://` is used if your production site supports it and `https://` triggers error `032-1035`).
3. Use the 3DS camera to scan and test

### Testing checklist
- [ ] Test on actual Old 3DS hardware (baseline)
- [ ] Test on New 3DS (performance comparison)
- [ ] Verify form submissions work
- [ ] Check page load times
- [ ] Test D-Pad/button navigation
- [ ] Test touch screen interactions

## 3DS browser constraints

This project demonstrates web development within the following 3DS browser limitations:

- **JavaScript:** ES3 only (no ES6+, no classes, no arrow functions)
- **CSS:** CSS 2.1 primarily (limited CSS3 support)
- **Canvas:** 2D context only (no WebGL)
- **Audio:** Limited codec support
- **Storage:** localStorage volatile, prefer cookies for persistence
- **Input:** D-Pad + A button + touchscreen (other buttons hijacked by browser)

See [SKILL.md](./SKILL.md) for detailed technical specifications.