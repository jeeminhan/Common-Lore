# Common Lore Card Game

A real-time multiplayer web application for the "Crossings: Guided Conversation Game" - facilitating meaningful cross-cultural conversations through thoughtful prompts and interactive gameplay.

## Live Demo

**Frontend:** https://crossings-card-game.pages.dev

## Features

- **Real-time Multiplayer**: Join games using room codes, play with 2-6 players
- **52 Conversation Cards**: Four themed suits (Career, Hospitality, Cultural, Wonder)
- **4 Action Cards**: Special gameplay mechanics (Referral, Shared Table, Translator, Experiment)
- **Session History**: Track highlighted moments and final reflections
- **Optional Timer**: Configurable turn timers for paced gameplay
- **Modern UI**: Smooth card animations, responsive design

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Zustand (state management)
- Socket.io-client (real-time)
- Framer Motion (animations)
- Tailwind CSS (styling)

### Backend
- Node.js + Express
- Socket.io (WebSocket server)
- Zod (validation)

### Infrastructure
- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend Hosting**: Cloudflare Pages
- **Shared Types**: TypeScript package

## Project Structure

```
crossings/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── pages/       # Route pages
│   │   │   ├── stores/      # Zustand stores
│   │   │   ├── hooks/       # Custom hooks
│   │   │   └── lib/         # Utilities
│   │   └── ...
│   └── server/              # Express + Socket.io backend
│       ├── src/
│       │   ├── socket/      # WebSocket handlers
│       │   ├── services/    # Business logic
│       │   └── config/      # Configuration
│       └── ...
└── packages/
    └── shared/              # Shared types & constants
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/fc-us/crossings.git
cd crossings

# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

This starts both the frontend (http://localhost:3000) and backend (http://localhost:3001).

### Testing Multiplayer

1. Open http://localhost:3000 in one browser
2. Create a room and note the room code
3. Open http://localhost:3000 in an incognito/private window
4. Join with the room code
5. Start the game from the host window

## Game Rules

### Card Suits
- **♠ Spades (Career Bridge)**: Vision & Responsibility
- **♥ Hearts (Hospitality Bridge)**: Oikos & Belonging
- **♦ Diamonds (Cultural Bridge)**: Identity & Wisdom
- **♣ Clubs (Wonder Bridge)**: Science & Faith

### Action Cards (Aces)
| Card | Effect |
|------|--------|
| ♠ The Referral | Nominate another player to answer a question |
| ♥ The Shared Table | Everyone must answer the last question |
| ♦ The Translator | Ask player to explain using metaphor/native language |
| ♣ The Experiment | Veto a question OR challenge another player |

### Gameplay
1. Each player receives 5 cards
2. Take turns clockwise: play a card → answer the prompt → discard
3. Use "Bridge Pass" to skip and draw a new card
4. Game ends when all hands are empty
5. Final Ritual: Share what you'll carry from the conversation

## Development

### Available Scripts

```bash
# Development (all apps)
pnpm dev

# Build all packages
pnpm build

# Type checking
pnpm --filter @crossings/web exec tsc --noEmit
pnpm --filter @crossings/server exec tsc --noEmit

# Clean build artifacts
pnpm clean
```

### Environment Variables

**Frontend (`apps/web/.env`):**
```env
VITE_SERVER_URL=http://localhost:3001
```

**Backend (`apps/server/.env`):**
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Deployment

### Frontend (Cloudflare Pages)

```bash
cd apps/web
pnpm build
wrangler pages deploy dist --project-name=crossings-card-game
```

### Backend

The backend requires a platform supporting WebSocket connections (Railway, Fly.io, Render, etc.).

See the deployment plan in `.claude/plans/` for detailed instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational and personal use.

## Acknowledgments

- Based on the physical "Crossings: Guided Conversation Game" card game
- Built with modern web technologies for accessible online play
