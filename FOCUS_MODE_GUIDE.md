# Focus Mode Implementation Guide

## ✅ Completed Implementation

Focus Mode has been successfully implemented! Players can now target specific intimate areas instead of getting random tasks.

---

## 🎯 Features Implemented

### 1. **Game Mode Toggle**
- Switch between **Normal Mode** (all tasks) and **Focus Mode** (category-specific tasks)
- Located in Settings page
- Persists across sessions

### 2. **Multi-Category Selection**
- Select **one or multiple** focus categories simultaneously
- 10 categories available:
  - 👅 Oral Play
  - 💋 Kissing & Lips
  - 🔥 Teasing & Foreplay
  - 👋 Hand Play
  - 🍑 Ass Play
  - 🔗 Dom/Sub
  - 👁️ Visual & Performance
  - 🤲 Touch & Massage
  - 🎭 Position Play
  - 🌶️ Penetration

### 3. **Automatic Filtering**
- Tasks automatically filtered by selected categories
- Works across **all activities** EXCEPT:
  - Body Explorer (excluded)
  - Strip Game (excluded)
- Falls back to all tasks if no matches found

### 4. **Visual Indicators**
- Header shows active focus mode: `🎯 Focus: Oral Play` or `🎯 Focus: 3 Categories`
- Settings shows category count: `(3 selected)`
- Green checkmarks on selected categories

---

## 📋 What Remains: Task Tagging

### Current Status
- ✅ Infrastructure complete
- ✅ Example tasks tagged (5 sample tasks in scratch-card.json)
- ⚠️ **~500-1000 tasks need category tags added**

### Task Format
Each task needs a `categories` array:

```json
{
  "id": 123,
  "description": "Kiss her neck while fingering her",
  "difficulty": "medium",
  "timer": 120,
  "categories": ["kissing", "hands"]  ← ADD THIS
}
```

### Tagging Guidelines

**Multiple tags are encouraged!** Most tasks combine activities:

| Task Description | Categories |
|------------------|------------|
| "Lick her pussy while she moans" | `["oral"]` |
| "Give a slow sensual blowjob" | `["oral", "teasing"]` |
| "Kiss her neck passionately for 60s" | `["kissing"]` |
| "Finger her while kissing deeply" | `["hands", "kissing"]` |
| "Spank her ass 10 times then make her beg" | `["ass", "domination"]` |
| "Fuck her doggy style for 2 minutes" | `["penetration", "positions"]` |
| "Strip dance then sit on his lap" | `["visual", "teasing"]` |
| "Massage her breasts while she moans" | `["touch"]` |
| "Get into 69 position with her on top" | `["oral", "positions"]` |

### Files to Tag

All JSON files in `/public/data/punishments/`:

**Easy Difficulty:**
- `easy/scratch-card.json` (partially done)
- `easy/spin-wheel.json`
- `easy/mini-game.json`
- `easy/would-you-rather.json`

**Medium Difficulty:**
- `medium/scratch-card.json`
- `medium/spin-wheel.json`
- `medium/mini-game.json`
- `medium/would-you-rather.json`

**Hard Difficulty:**
- `hard/scratch-card.json`
- `hard/spin-wheel.json`
- `hard/mini-game.json`
- `hard/would-you-rather.json`

**Note:** Body Explorer and Strip Game files don't need tagging (they're excluded from focus mode).

---

## 🚀 How to Use Focus Mode

### For Players:
1. Open Settings (⚙️ button)
2. Toggle to **Focus Mode**
3. Select one or more categories
4. Start any activity (Scratch, Spin, etc.)
5. Only tasks matching your selections will appear

### Testing:
1. Enable Focus Mode
2. Select **"Kissing & Lips"** category
3. Play Scratch Card activity
4. All revealed tasks should be kissing-related
5. Header should show: `🎯 Focus: Kissing & Lips`

---

## 🔧 Technical Details

### State Management
- `gameMode`: `'normal' | 'focus'`
- `focusCategories`: `string[]` (array of category IDs)

### Filtering Logic
```typescript
// In usePunishments hook:
if (gameMode === 'focus' && focusCategories.length > 0) {
  filtered = tasks.filter(task => 
    task.categories?.some(cat => focusCategories.includes(cat))
  );
}
```

### Key Files Modified
1. `src/types/game.types.ts` - Added categories field
2. `src/constants/focusCategories.ts` - Category definitions
3. `src/context/GameContext.tsx` - State management
4. `src/components/ui/Settings.tsx` - UI controls
5. `src/hooks/usePunishments.ts` - Filtering logic
6. `src/components/ui/Header.tsx` - Visual indicator

---

## 📊 Tagging Progress

- ✅ Infrastructure: 100%
- ⚠️ Task Tagging: ~1% (5 out of ~500 tasks)
- ⏳ Estimated time to complete tagging: 15-20 hours

### Quick Tagging Tips
1. Read task description
2. Identify all activities mentioned
3. Add relevant category tags
4. Use multiple tags when appropriate
5. Test with focus mode enabled

---

## 🎉 Ready to Test!

Focus Mode is **fully functional** and ready for testing with the sample tasks that have been tagged. To test:

1. Launch the app
2. Open Settings
3. Enable Focus Mode
4. Select "Kissing & Lips" OR "Touch & Massage"
5. Open Scratch Card activity
6. The first 5 cards should filter based on your selection!

---

## 📝 Next Steps

1. **Tag remaining tasks** (~500-1000 tasks across all difficulty levels)
2. **Test each category** to ensure proper filtering
3. **Adjust categories** if needed based on task distribution
4. **Consider adding preset combinations** (e.g., "Oral Night", "Dom/Sub Play")

---

Focus Mode is ready to use! 🎯
