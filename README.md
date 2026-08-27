# LIP TALK — Digital Business Networking & Growth Platform

# CONNECT • PROMOTE • GROW

> **Help people and businesses discover the right connections based on what they need and what they offer, and turn those connections into meaningful leads, opportunities, partnerships, and business growth.**

---

## 🚀 The Core Value Loop

$$\text{NEED / OFFER} \longrightarrow \text{MATCH} \longrightarrow \text{CONNECT} \longrightarrow \text{CONTEXTUAL CHAT} \longrightarrow \text{CRM LEAD} \longrightarrow \text{OPPORTUNITY} \longrightarrow \text{GROWTH}$$

---

## 📁 Repository Structure

```text
/
├── backend/                    # NestJS Modular Monolith API
│   ├── src/
│   │   ├── database/           # TypeORM Entities (PostgreSQL + PostGIS / SQLite) & Database Seeders
│   │   ├── modules/
│   │   │   ├── auth/           # JWT authentication, session tokens & OTP
│   │   │   ├── matching/       # Multi-factor Deterministic Need <-> Offer Matching Algorithm
│   │   │   ├── needs-offers/   # Structured Need & Offer management
│   │   │   ├── opportunities/  # Business requirements & pitch proposals
│   │   │   ├── leads/          # CRM Lead pipeline & activity timeline notes
│   │   │   ├── chat/           # Context-preserving WebSocket Gateway & message store
│   │   │   ├── partners/       # Ecosystem partner directory & corporate perks
│   │   │   └── analytics/      # Profile views, active matches, and conversion metrics
│   │   ├── app.module.ts
│   │   └── main.ts             # Swagger documentation & Global Validation Pipes
│   └── package.json
│
├── mobile/                     # Expo React Native App (TypeScript + Expo Router + TanStack Query + Zustand)
│   ├── app/                    # File-based navigation screens
│   │   ├── (auth)/             # Login, Register, OTP Verification
│   │   ├── (onboarding)/       # Role selection, Profile Builder, Needs & Offers Setup
│   │   ├── (tabs)/             # Discover (Home), Network, Opportunities, Communities, Profile
│   │   ├── chat/               # Contextual real-time chat rooms
│   │   ├── leads/              # B2B Lead CRM pipeline
│   │   ├── opportunities/      # Requirements posting and proposals
│   │   └── notifications.tsx   # System & Match notification center
│   ├── src/
│   │   ├── api/                # Axios client & domain endpoints
│   │   ├── components/         # Atomic UI design system (MatchCard, LeadCard, OpportunityCard, PartnerCard)
│   │   ├── constants/          # Theme tokens, Dark Mode palette, typography
│   │   ├── store/              # Zustand Auth store
│   │   └── types/              # Full TypeScript contracts
│   └── package.json
│
├── docs/                       # Strategic plans, architecture documents & specs
│   └── LIPTALK_STRATEGIC_IMPROVEMENT_PLAN.md  # Product, UI/UX & Architecture Roadmap
│
├── media/                      # Consolidated marketing, branding, & media assets
│   ├── branding/               # Specifications, poster mockups, and PDFs
│   ├── promotions/             # Demo videos and promotional clips
│   └── character-design/       # Mascot and cartoon art assets
│
├── scripts/                    # Asset generation & project utilities
│   ├── extract_mascots.py      # Mascot image isolation & generation
│   ├── make_neat_mascot.py     # High-res polygon alpha extraction
│   ├── generate-splash.ps1     # Native splash screen builder
│   └── setup-mascots.js        # Asset distribution script
│
├── tests/                      # Verification test suites
│   ├── test-ai-foundation.js   # AI gateway & prompt templates suite
│   ├── test-globalization.js   # Multi-currency & localization suite
│   └── test-phase*.js / *.ts   # Phase validation test suites
│
└── docker-compose.yml          # PostgreSQL (with PostGIS) and Redis services
```

---

## 📖 Strategic Improvement Plan
For the comprehensive Product Strategy, UI/UX Redesign Proposal, and Engineering Roadmap (including NoBroker Disintermediation comparison), see:
👉 **[LIPTALK_STRATEGIC_IMPROVEMENT_PLAN.md](docs/LIPTALK_STRATEGIC_IMPROVEMENT_PLAN.md)**

---

## 🛠️ Quick Start

### 1. Database & Infrastructure
```bash
docker-compose up -d
```

### 2. Run Backend API
```bash
cd backend
npm install
npm run start:dev
```
- **REST API Base URL**: `http://localhost:3000/api/v1`
- **Interactive Swagger Docs**: `http://localhost:3000/api/docs`

### 3. Run Mobile App
```bash
cd mobile
npm install
npx expo start
```
Run on iOS Simulator, Android Emulator, or Web by pressing `i`, `a`, or `w`.

---

## 🧠 Deterministic Matching Formula

$$\text{Total Score} = 0.40 \times S_{\text{category}} + 0.25 \times S_{\text{tags\_jaccard}} + 0.15 \times S_{\text{geo}} + 0.10 \times S_{\text{activity}} + 0.10 \times S_{\text{reciprocal}}$$

* **Category Alignment (40%)**: Subcategory and vertical alignment.
* **Tag & Skill Overlap (25%)**: Exact tokenized Jaccard index of tags.
* **Geographic Vicinity (15%)**: City and distance scoring.
* **Profile Health & Activity (10%)**: Profile completion and verification.
* **Reciprocal Synergy (10%)**: 2-way Need $\leftrightarrow$ Offer alignment bonus.
