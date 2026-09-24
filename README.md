# KWS Pulse - Next.js Full-Stack SEO Keyword Research Web App

A web-only SEO Keyword Research platform built with **Next.js + Tailwind CSS** on the frontend and **Node.js + Express** on the backend.

![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-06b6d4)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-10b981)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-emerald)

---

## Features

- **Next.js Landing Page**: Hero section, feature matrix, and pricing table (Free, Pro, Agency).
- **Supabase Auth Pages**: Dedicated `/login` and `/signup` routes with local auth fallback.
- **Dashboard (`/dashboard`)**:
  - Single keyword search bar & Bulk CSV file drag-and-drop parser.
  - Results table showing: Keyword, Estimated Search Volume, Trend Direction (📈 Upward / ➡️ Stable / 📉 Downward), Competition Level (Low / Medium / High), and Autocomplete long-tail suggestions.
  - Domain Authority Checker: OpenPageRank score lookup (DA 0-100).
  - Export Results: One-click CSV download.
  - Credits Badge: Free trial credit counter.
- **Express REST API Server**: Port `99009` with rate-limiting, Mongoose schemas, and Google Autocomplete integrations.

---

## Directory Structure

```
kws/
├── frontend/                   # Next.js (App Router) + Tailwind CSS
│   ├── app/
│   │   ├── layout.jsx          # Root layout & navbar
│   │   ├── page.jsx            # Landing Page (Hero, Features, Pricing)
│   │   ├── dashboard/page.jsx  # Research Dashboard & DA Checker
│   │   ├── login/page.jsx      # Supabase Auth Login
│   │   └── signup/page.jsx     # Supabase Auth Signup
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Pricing.jsx
│   │   ├── Footer.jsx
│   │   └── Dashboard/          # KeywordInput, ResultsTable, DomainChecker, CreditsDisplay
│   ├── package.json
│   └── next.config.js
│
├── backend/                    # Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/        # Keyword, Domain, User controllers
│   │   ├── services/           # Google Autocomplete, Trends, OpenPageRank
│   │   ├── middleware/         # Auth, Rate Limiter, Error Handler
│   │   ├── models/             # User, KeywordHistory, CreditLog schemas
│   │   └── server.js           # Port 99009 entry point
│   └── package.json
│
└── README.md
```

---

## Local Development Setup

### 1. Start the Backend API (Port 99009)
```bash
cd backend
cmd /c npm install
npm run dev
```

### 2. Start the Next.js Web App (Port 4000)
```bash
cd frontend
cmd /c npm install
npm run dev
```

Open `http://localhost:4000` in your browser.

---

## REST API Documentation

### 1. `POST /api/keywords/research`
Takes array of keywords, returns search volume, trend direction, competition level, and autocomplete suggestions.

**Request:**
```json
{
  "keywords": ["seo software", "keyword research tools"]
}
```

**Response:**
```json
{
  "status": "success",
  "count": 2,
  "remainingCredits": 248,
  "data": [
    {
      "keyword": "seo software",
      "searchVolume": 135000,
      "trendDirection": "📈 Upward",
      "competition": "HIGH",
      "competitionScore": 82,
      "difficulty": 74,
      "cpc": 8.50,
      "suggestions": ["free seo tools", "best keyword software"]
    }
  ]
}
```

### 2. `POST /api/domain/metrics`
Takes domain URL and returns OpenPageRank domain authority score (0-100).

### 3. `GET /api/user/credits`
Returns remaining user credits.

---

&copy; 2026 KWS Pulse SEO. Built with Next.js, Express & Tailwind CSS.
