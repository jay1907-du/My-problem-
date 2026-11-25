# FloodGuard - Hyderabad

Real-time urban flood detection, hydrological zone monitoring, and emergency response dashboard built with **React**, **Vite**, and **Tailwind CSS** for the Hyderabad Hackathon.

## Features

- **Live Header Telemetry**: Brand header with blinking `LIVE` indicator, live clock, instant `Refresh` trigger, and quick `Emergency` navigation.
- **4 Reusable Stat Cards**: Live metrics for Water Level (`4.2m`), Rainfall (`85mm`), Risk Level (`HIGH`), and Affected Areas (`12`) with hover elevation.
- **Interactive Hyderabad Flood Map**: Stylized hydrological map showing Musi River, Hussain Sagar, Manikonda, LB Nagar, and Jubilee Hills as color-coded clickable markers.
- **Zone Alert Popup**: Clicking any map marker or table row opens a detailed modal showing water level vs. danger threshold, sensor count, nearest relief shelter, and evacuation advisory.
- **24-Hour Water Level Chart**: Interactive bar chart displaying the 24-hour rising water trend with a `4.0m` danger threshold line and hover tooltips.
- **Dynamic Alerts Table**: Filterable table sourced from `floodData.js` showing Area, Water Level, Status (`HIGH` / `MEDIUM` / `LOW`), and Action (`Evacuate` / `Alert` / `Safe`).
- **Flood Simulation Mode**: `Simulate Flood` button triggers a live surge across zones, raising water levels and turning zones Red (`HIGH` / `Evacuate`), with one-click reset.
- **Emergency Directory**: Direct-dial `112` National Helpline, `040-2345-6789` GHMC Flood Control Room, and active shelter directory (`8 Open`).

## Project Structure

```text
floodguard-hyderabad/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── data/
│   │   └── floodData.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── StatCards.jsx
│   │   ├── FloodMap.jsx
│   │   ├── WaterChart.jsx
│   │   ├── AlertsTable.jsx
│   │   ├── EmergencyInfo.jsx
│   │   └── AlertPopup.jsx
│   ├── pages/
│   │   └── Dashboard.jsx
│   └── hooks/
│       └── useFloodData.js
├── public/
│   └── vite.svg
├── index.html
├── package.json
└── README.md
```

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Hackathon Team File Ownership

| Team Member | Role | Assigned Files |
| :--- | :--- | :--- |
| **Member 1** | Data & State Lead | `src/data/floodData.js`, `src/hooks/useFloodData.js` |
| **Member 2** | Map & Telemetry UI | `src/components/FloodMap.jsx`, `src/components/AlertPopup.jsx` |
| **Member 3** | Metrics & Visualization | `src/components/StatCards.jsx`, `src/components/WaterChart.jsx` |
| **Member 4** | Shell, Alerts & Emergency | `src/components/Header.jsx`, `src/components/AlertsTable.jsx`, `src/components/EmergencyInfo.jsx` |
| **All / Integrator** | Page Layout & Routing | `src/pages/Dashboard.jsx`, `src/App.jsx`, `src/index.css` |
