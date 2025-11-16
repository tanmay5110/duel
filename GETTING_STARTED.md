# 🚀 GETTING STARTED WITH DUEL GAME

## ✅ PROJECT SETUP COMPLETE!

Your project structure is **100% ready** with all foundational components in place.

---

## 📦 STEP 1: INSTALL DEPENDENCIES

Open your terminal in the project directory and run:

```powershell
cd d:\DUEL
npm install
```

This will install:
- React 18.2.0
- React Router DOM 6.20.0
- Framer Motion 10.16.16
- React Confetti 6.1.0
- Vite 5.0.8
- TypeScript 5.2.2
- TailwindCSS 3.4.0
- And all development dependencies

**Estimated time:** 2-3 minutes

---

## 🎮 STEP 2: START DEVELOPMENT SERVER

```powershell
npm run dev
```

This will:
- Start Vite development server on http://localhost:3000
- Enable hot module replacement (instant updates)
- Open browser automatically

**Note:** Currently only the Setup page is functional. Game, Results, and Activity components need to be built.

---

## 📂 WHAT'S ALREADY BUILT

### ✅ Complete Infrastructure (62% Done)
```
✅ Configuration (9 files)
   - package.json, tsconfig, vite.config, tailwind.config, etc.

✅ Data Layer (72 punishments)
   - 12 JSON files with gender-specific punishments
   - Organized by difficulty (easy/medium/hard)
   - Organized by activity type (4 types)

✅ Type System
   - Complete TypeScript interfaces
   - Player, Punishment, GameState types

✅ State Management
   - GameContext with useReducer
   - Auto-save to localStorage

✅ Custom Hooks (4 hooks)
   - useLocalStorage, useBackButton, usePunishments, useTimer

✅ Utilities (3 files)
   - Storage helpers, punishment loader, validators

✅ Styling
   - Global CSS with TailwindCSS
   - Custom color palette (male/female themes)
   - Mobile-first responsive utilities

✅ Pages (1/3)
   - Setup.tsx ✅ (Player & difficulty selection)
```

---

## ⏳ WHAT NEEDS TO BE BUILT

### Remaining Components (38% - ~6-8 hours)

#### 1. Game Page (`src/pages/Game.tsx`)
**Purpose:** Main game interface with activity selection
**Features:**
- Activity selector (4 buttons)
- Current player indicator
- Score display
- Round counter
- "End Game" button

**Estimated time:** 45-60 minutes

---

#### 2. Results Page (`src/pages/Results.tsx`)
**Purpose:** End game summary and replay option
**Features:**
- Final scores display
- Punishment counts
- Winner declaration
- Confetti animation
- Replay/New Game buttons

**Estimated time:** 30 minutes

---

#### 3. UI Components (`src/components/ui/`)

##### Timer.tsx
- Countdown display
- Progress bar/circle
- Color changes (green → yellow → red)
- Sound/vibration on complete (optional)

##### PlayerCard.tsx
- Player name & gender icon
- Score display
- Punishments received
- Active/inactive state

##### PunishmentDisplay.tsx
- Punishment description
- Timer integration
- Animated reveal
- Completion button

**Estimated time:** 30-45 minutes total

---

#### 4. Activity Components (`src/components/activities/`)

##### MiniGame.tsx
**Type:** Competitive (Simultaneous play)
**Examples to implement:**
- XO Reaction Test (tap faster)
- Quick Math Challenge
- Memory Match
- Color Recognition

**Core logic:**
- Both players tap/interact simultaneously
- Winner determined by speed/accuracy
- Loser gets punishment

**Estimated time:** 60-90 minutes

---

##### ScratchCard.tsx
**Type:** Turn-based
**Mechanic:** Scratch to reveal punishment

**Features:**
- Canvas-based scratch area
- Progress tracking
- Reveal animation when 60% scratched
- "Pass Device" prompt

**Estimated time:** 45-60 minutes

---

##### SpinWheel.tsx
**Type:** Turn-based
**Mechanic:** Spin wheel to land on punishment

**Features:**
- Animated wheel rotation
- Physics-based spin
- Land on random punishment
- Visual feedback

**Estimated time:** 60-90 minutes

---

##### BodyExplorer.tsx
**Type:** Simultaneous
**Mechanic:** Random body part + action assignment

**Features:**
- Random assignment for both players
- Visual body diagram (optional)
- Timer for both tasks
- No winner/loser (both perform tasks)

**Estimated time:** 30-45 minutes

---

## 🎯 DEVELOPMENT WORKFLOW

### Phase 1: Core Pages (2-3 hours)
```
1. Build Game.tsx
   - Layout & navigation
   - Activity selector UI
   - State management integration

2. Build Results.tsx
   - Score calculation
   - Winner logic
   - Replay functionality

3. Test navigation flow
   - Setup → Game → Results → Setup
```

### Phase 2: UI Components (1 hour)
```
1. Timer.tsx → Test with mock data
2. PlayerCard.tsx → Test with different states
3. PunishmentDisplay.tsx → Test with various punishments
```

### Phase 3: Activities (3-4 hours)
```
1. MiniGame.tsx → Simplest competitive game first
2. ScratchCard.tsx → Canvas implementation
3. SpinWheel.tsx → Animation & physics
4. BodyExplorer.tsx → Random assignment logic
```

### Phase 4: Integration & Testing (1-2 hours)
```
1. Connect all activities to Game.tsx
2. Test punishment loading from JSON
3. Test localStorage persistence
4. Mobile responsiveness check
5. Cross-browser testing
```

---

## 🛠️ USEFUL COMMANDS

```powershell
# Development server
npm run dev

# Type checking
npx tsc --noEmit

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📱 TESTING CHECKLIST

### Mobile Testing
- [ ] Tap targets are large enough (44x44px minimum)
- [ ] No accidental zooms on double-tap
- [ ] Smooth scrolling and animations
- [ ] Portrait orientation optimized
- [ ] Touch events work properly

### Feature Testing
- [ ] Player setup validation works
- [ ] Gender pairing enforced
- [ ] Difficulty affects punishments
- [ ] All activities load correct JSON
- [ ] Timers count down accurately
- [ ] Scores update correctly
- [ ] LocalStorage saves/loads properly
- [ ] Back button handled correctly

### Browser Testing
- [ ] Chrome (Android & Desktop)
- [ ] Safari (iOS & Desktop)
- [ ] Firefox
- [ ] Edge

---

## 🎨 DESIGN GUIDELINES

### Colors to Use
```typescript
// Male player
className="bg-male text-white"           // #3B82F6
className="border-male"
className="text-male"

// Female player
className="bg-female text-white"         // #EC4899
className="border-female"
className="text-female"

// Neutral/Gradient
className="bg-gradient-to-r from-male to-female"
```

### Component Patterns
```typescript
// Button pattern
<button className="btn-primary bg-male hover:bg-male-dark">

// Card pattern
<div className="card">

// Input pattern
<input className="input-field" />

// Title pattern
<h1 className="section-title">
```

---

## 🐛 TROUBLESHOOTING

### Issue: Dependencies not installing
```powershell
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -r node_modules, package-lock.json
# Reinstall
npm install
```

### Issue: TypeScript errors in IDE
```powershell
# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: Tailwind classes not working
```powershell
# Make sure dev server is running
npm run dev
# Check tailwind.config.js content paths
```

### Issue: JSON files not loading
- Check file paths in `punishmentLoader.ts`
- Ensure files are in `public/data/punishments/`
- Check browser console for 404 errors

---

## 📚 HELPFUL RESOURCES

### React + TypeScript
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Styling
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

### Canvas (for Scratch Card)
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

### Touch Events
- [Touch Events Guide](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

## 🚀 READY TO BUILD!

Your development environment is **fully configured** and ready to go!

### Next Action:
```powershell
cd d:\DUEL
npm install
npm run dev
```

Then open your browser to http://localhost:3000 and start building! 🎮

---

**Need help with any specific component? Just ask and I'll build it for you!** 💪
