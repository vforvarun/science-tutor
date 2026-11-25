# Spark! — Science tutor (Years 9–10)

A study app for **Victorian Curriculum Science, Levels 9–10**, built to explain ideas simply and give unlimited practice.

- **25 topics** across Biology, Chemistry, Physics, Earth & space and Science skills (variables, fair tests, graphs, conclusions).
- **Animated, narrated lessons** for every topic — SVG animations with a natural pre-recorded voice (Kokoro, voice `bf_emma`), falling back to the device voice.
- **Plain-English lessons** with an everyday analogy, worked examples, common mistakes, key formulas and a **key-terms glossary** for each topic.
- **Master it** (IXL/Kumon-style): unlimited practice with a SmartScore to 100, mistake diagnosis (unit slips, km/h vs m/s, forgetting to square…), step-by-step solutions and a help panel after two misses.
- **Questions that change every time**: calculations (V = IR, speed, F = ma, energy, half-life, waves, Punnett squares, food chains…) plus large banks of concept questions; answers can be typed with units (“12 N”, “3.5 m/s”).
- **Daily plan**, quick-fire key terms, topic tests, timed mock exam, printable cheat sheet, term planner, progress & parent dashboard.

```bash
npm install
npm run dev      # local dev server
npm run check    # stress-tests every question generator and all lesson maths/chemistry
npm run build
```

Narration: after changing any lesson’s narration text, re-record the changed lines with `scripts/narrate.ts` (see the header of that file).

Deploys to GitHub Pages on every push to `main`.
