# SkyGauge — Weather Forecast App

A responsive weather forecasting app built with React, Vite, and Tailwind CSS,
using the free [Open-Meteo](https://open-meteo.com) API (no API key required).

## Features

- City search with live autocomplete
- Geolocation ("use my location") with reverse geocoding
- °C / °F unit toggle
- Current conditions with a sun-arc sunrise/sunset gauge
- 24-hour hourly forecast strip
- 7-day daily forecast with hi/lo range bars
- Humidity, wind speed + direction, sunrise/sunset
- Fully responsive, dark "instrument panel" design

## Run it in VS Code

**Requirements:** [Node.js](https://nodejs.org) 18 or newer (includes npm).
Check with `node -v` in a terminal — install Node first if that command isn't found.

1. Unzip this project and open the folder in VS Code (`File > Open Folder...`).
2. Open a terminal in VS Code (`` Ctrl+` `` / `` Cmd+` ``).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open the URL it prints (usually `http://localhost:5173`) in your browser.

The app hot-reloads as you edit files in `src/`.

## Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

The production files are output to `dist/`.

## Project structure

```
skygauge-app/
├── index.html              # Vite entry HTML
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx             # React entry point
    ├── App.jsx               # Main app component
    ├── index.css             # Tailwind directives + custom animations
    ├── lib/
    │   └── weather.js         # Helpers, constants, formatting
    └── components/
        ├── WeatherIcon.jsx
        ├── SunArcGauge.jsx
        └── StatCard.jsx
```

## Notes

- No API key is required — Open-Meteo and the BigDataCloud reverse-geocoding
  endpoint are both free and CORS-enabled.
- Geolocation requires the browser tab to be served over `http://localhost`
  or `https://` — this works out of the box with `npm run dev`.
- If geolocation is denied or unavailable, the app falls back to New Delhi.
