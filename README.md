# Research Participant Manager - Frontend

A React frontend for the Research Participant Manager API.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router

## Features

- **Dashboard** - Overview stats and recent studies
- **Studies** - Browse and filter studies, view details
- **Study Detail** - View criteria, find matching respondents, assign participants
- **Respondents** - Browse and filter respondents with pagination

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Railway
```bash
npm run build
# Deploy with static site hosting
```

## API Connection

The frontend connects to:
```
https://web-production-ca37.up.railway.app
```

To change the API URL, edit `src/api.js`.
