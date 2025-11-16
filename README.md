# 🎮 DUEL - 2-Player Mobile Challenge Game

A mobile-first, web-based game where two players of opposite genders compete across multiple activities with dynamic punishments.

## 🚀 Features

- **4 Activity Modes**: Mini-Games, Scratch Cards, Spin Wheel, Body Explorer
- **Gender-Specific Gameplay**: Male vs Female players
- **3 Difficulty Levels**: Easy, Medium, Hard
- **Dynamic Punishments**: JSON-based punishment system
- **Mobile Optimized**: Touch-friendly interface
- **Data Persistence**: LocalStorage for game state

## 📦 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **State**: React Context API

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
duel/
├── public/data/punishments/  # JSON punishment files
├── src/
│   ├── components/           # React components
│   ├── context/              # Global state
│   ├── hooks/                # Custom hooks
│   ├── pages/                # Route pages
│   ├── types/                # TypeScript types
│   └── utils/                # Helper functions
└── ...config files
```

## 🎯 Game Flow

1. Player Setup (Gender + Names)
2. Difficulty Selection
3. Activity Selection/Cycle
4. Punishment Execution
5. Results & Replay

## 📝 License

MIT License - Feel free to modify and use!
