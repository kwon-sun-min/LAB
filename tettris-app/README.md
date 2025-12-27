# Modern Tetris Web App

A fully functional, mobile-responsive Tetris game built with React, TypeScript, and Tailwind CSS.

## Features

- **Standard Tetris Mechanics**: 10x20 grid with all 7 standard tetrominoes
- **Ghost Piece**: Visual indicator showing where the current piece will land
- **Hold Mechanism**: Press 'Q' to hold/swap pieces (with proper restrictions)
- **Leveling System**: Speed increases as score increases
- **Modern UI**: Dark mode aesthetic with clean, responsive design
- **Mobile-First**: Optimized for mobile screens with desktop support

## Controls

- **←** / **→**: Move left/right
- **↑**: Rotate clockwise
- **↓**: Rotate counter-clockwise
- **Space**: Hard drop (instant drop)
- **Q**: Hold/swap piece
- **P**: Pause/resume

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # React components
│   ├── Board.tsx     # Main game board
│   ├── Cell.tsx      # Individual cell component
│   ├── Game.tsx      # Main game component with controls
│   ├── PiecePreview.tsx  # Next/Hold piece preview
│   └── Stats.tsx     # Score, level, lines display
├── hooks/
│   └── useTetris.ts  # Main game logic hook
├── types.ts          # TypeScript type definitions
├── constants.ts      # Game constants (tetrominoes, colors, etc.)
├── utils.ts          # Utility functions (collision, rotation, etc.)
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## Game Mechanics

- **Scoring**: Points awarded for clearing lines (100, 300, 500, 800 for 1-4 lines)
- **Leveling**: Level increases every 500 points
- **Speed**: Drop interval decreases by 10% per level
- **Hold Restriction**: Cannot hold twice in a row without dropping a piece

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS


