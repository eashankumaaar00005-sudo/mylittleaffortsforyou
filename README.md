# Friendship Day — Premium Wishing Website

A handcrafted, mobile-first Friendship Day wishing experience built with pure
HTML, CSS and vanilla JavaScript. No frameworks, no build step, no libraries.

## Features

- Animated welcome / entry screen
- Gradient Friendship Day title with premium typography
- Typewriter message loop
- Reveal button that opens a personalised wish card
- Memory gallery with hover/zoom frames
- Floating hearts + glowing particle field (canvas)
- Confetti celebration (canvas)
- Music play/pause button (uses `assets/audio/friendship-theme.mp3` if present,
  otherwise falls back to a soft Web Audio ambient pad)
- Scroll reveal animations and an animated ending section
- Respects `prefers-reduced-motion`

## Structure

```
friendship-day-website/
├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
└── assets/
    ├── images/
    ├── audio/
    └── icons/
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Personalise it

- **Message**: edit `.wish-text` and `.wish-sign` in `index.html`
- **Typewriter lines**: edit the `LINES` array in `script.js`
- **Photos**: replace the files in `assets/images/`
- **Music**: drop your track at `assets/audio/friendship-theme.mp3`
- **Colours**: change the tokens in the `:root` block of `style.css`

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel). Push the folder as-is.
