# <p align="center"><img src="https://i.pinimg.com/736x/68/95/2b/68952b35bad3b8786470e09505730fd4.jpg" alt="axon" width="40" style="display: inline-block; vertical-align: middle; margin-right: 8px;"> <img src="assets/axon-logo.svg" alt="axon" height="36" style="display: inline-block; vertical-align: middle;"></p>

> **Simple, Lightweight, Flashcard Studying.**

Axon is a light-weight flashcard studying tool designed to be super basic with a nice UI. Check it out [here!](https://axon-client-production.up.railway.app/)

---

<p align="center">
  <img src="https://i.pinimg.com/736x/4c/27/fd/4c27fd0c62dee4c6f861291ca3dc6769.jpg" alt="axon hero" width="50%">
</p>

---

## Current Features

- **Create Decks** — Build flashcard decks and organize cards however you want.
- **Study Mode** — Flip through cards at your own pace. Check off if you recalled it or not to come back to it later.
- **Quiz Yourself** — Auto-generated multiple choice questions test your knowledge.
- **Track Progress** — See your improvement over time. Know exactly what you need to review.
- **Public Decks** — Share decks with the community and discover what others are studying.

## Dev

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/briangasca/axon.git
cd axon

# Install dependencies
cd client && npm install
cd ../server && npm install
```

### Running Locally

**Terminal 1 — Frontend:**
```bash
cd client
npm run dev
```

**Terminal 2 — Backend:**
```bash
cd server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** Session-based auth with JWT

## 📁 Project Structure

```
axon/
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth and state
│   │   └── api/         # API calls
│   └── package.json
├── server/              # Express backend
│   ├── routes/
│   ├── models/
│   └── package.json
└── README.md
```

## 🗺️ Roadmap

- [ ] Multiple Choice Quiz Mode
- [ ] Create New Deck Page
- [ ] Unified Design System
- [ ] Dark Mode Support
- [ ] Deck Search & Filtering
- [ ] Spaced Repetition Algorithm
- [ ] Mobile App (React Native)

See [Issues](https://github.com/briangasca/axon/issues) for more planned features.

---

Made with ❤️ for better studying.
