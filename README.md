# 3DS Web Skills

Web development skills for the Nintendo 3DS browser.

**Official Browser Specs:** https://archive.today/8qs51

**Live:** https://ethanthatonekid.github.io/3ds-web-skills/

---

## Games

- [snake.html](./examples/snake.html) - Classic snake with high score
- [flappy-bird.html](./examples/flappy-bird.html) - Flappy bird clone
- [concentration.html](./examples/concentration.html) - Memory matching game
- [breakout.html](./examples/breakout.html) - Paddle and brick breaker
- [pong.html](./examples/pong.html) - Single player vs CPU
- [tetris.html](./examples/tetris.html) - Block stacking game
- [space-invaders.html](./examples/space-invaders.html) - Space shooter

---

## Utilities

- [calculator.html](./examples/calculator.html) - Integer calculator with D-Pad navigation
- [stopwatch.html](./examples/stopwatch.html) - Timer with Pomodoro support
- [touch-draw.html](./examples/touch-draw.html) - Canvas drawing with cookie persistence
- [todo.html](./examples/todo.html) - Todo list with cookie storage

---

## Demos

- [debug.html](./examples/debug.html) - Input tester for D-Pad/A button
- [adventure.html](./examples/adventure.html) - Text adventure with inventory
- [pizza.html](./examples/pizza.html) - Interactive cartoon with dialog
- [ascii-movie.html](./examples/ascii-movie.html) - Text-based animation
- [spirograph.html](./examples/spirograph.html) - Procedural art generator
- [chiptune.html](./examples/chiptune.html) - Audio player with visualizer

---

## 3DS Browser Constraints

This project demonstrates web development within the following 3DS browser limitations:

- **JavaScript:** ES3 only (no ES6+, no classes, no arrow functions)
- **CSS:** CSS 2.1 primarily (limited CSS3 support)
- **Canvas:** 2D context only (no WebGL)
- **Audio:** Limited codec support
- **Storage:** localStorage volatile, prefer cookies for persistence
- **Input:** D-Pad + A button + touchscreen (other buttons hijacked by browser)

See [SKILL.md](./SKILL.md) for detailed technical specifications.