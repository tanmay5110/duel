# Focus Mode Sample Tasks - Category Coverage

## Overview
Sample tasks have been tagged across multiple difficulty levels and activities to enable comprehensive testing of Focus Mode.

## Category Coverage Summary

### ✅ Well-Represented Categories (with samples):

1. **kissing** - 15+ tasks
   - Easy: Gentle forehead kisses, sweet kisses
   - Medium: Neck kisses, passionate kisses
   - Hard: Passionate make-out, stomach kisses, collarbone

2. **touch** - 15+ tasks
   - Easy: Shoulder massage, hair play
   - Medium: Body massage, fingertip tracing
   - Hard: Full body massage, inner thigh massage

3. **visual** - 20+ tasks
   - Easy: Dance, poses, physical challenges
   - Medium: Striptease, slow undressing
   - Hard: Lap dance, sensory experiences

4. **teasing** - 15+ tasks
   - Easy: Compliments, playful poses
   - Medium: Slow undressing, body tracing
   - Hard: Edging, sensory denial

5. **hands** - 10+ tasks
   - Easy: Hand massage, hair play
   - Medium: Body exploration, sensual massage
   - Hard: Shower massage, full body contact

6. **domination** - 8+ tasks
   - Medium: Blindfolding, control play
   - Hard: Take control, surrender control, wall pin

7. **positions** - 5+ tasks
   - Hard: Daring new position, lap dance position

8. **penetration** - 4+ tasks
   - Hard: Take control scenarios, new positions

9. **oral** - 2+ tasks
   - Hard: Tongue tracing, passionate stomach kisses

### ⚠️ Under-Represented Categories:

10. **ass** - 0 explicit tasks
    - Note: Current dataset doesn't have explicit ass-focused tasks
    - Consider adding in future: spanking, squeezing, focused attention

## Files Tagged

### Easy Difficulty
- `scratch-card.json` - 7 tasks tagged
- `spin-wheel.json` - 5 tasks tagged
- `would-you-rather.json` - 5 tasks tagged
- `mini-game.json` - 6 tasks tagged

### Medium Difficulty
- `scratch-card.json` - 5 tasks tagged
- `spin-wheel.json` - 6 tasks tagged
- `would-you-rather.json` - 5 tasks tagged
- `mini-game.json` - 6 tasks tagged

### Hard Difficulty
- `scratch-card.json` - 7 tasks tagged (including 2 oral tasks)
- `spin-wheel.json` - 10 tasks tagged
- `would-you-rather.json` - 5 tasks tagged
- `mini-game.json` - 6 tasks tagged

## Total Sample Tasks Tagged: ~73 tasks

## Testing Recommendations

1. **Test Single Category Focus**
   - Select each category individually
   - Verify tasks appear correctly
   - Check fallback behavior if category has few tasks

2. **Test Multi-Category Focus**
   - Select 2-3 categories together
   - Verify tasks matching ANY category appear
   - Test combinations: kissing+teasing, domination+penetration, etc.

3. **Test Edge Cases**
   - No categories selected → should show all tasks
   - All categories selected → should show all tasks
   - Category with no matching tasks → falls back to all tasks

4. **Test Activity Exclusions**
   - Body Explorer should ignore focus mode
   - Strip Game should ignore focus mode
   - All other activities should filter correctly

## Multi-Tag Examples

Tasks with multiple relevant categories:
- "Lap dance" = visual + teasing + positions
- "Blindfold and sensory play" = domination + visual + touch
- "Passionate stomach kisses" = oral + kissing
- "Inner thigh massage" = touch + kissing + teasing
- "Take control completely" = domination + penetration

## Next Steps

1. ✅ Infrastructure complete
2. ✅ Sample tasks tagged
3. ⏳ Manual testing required
4. ⏳ Consider adding more "ass" category tasks
5. ⏳ Bulk tagging remaining ~900 tasks (future work)

## Notes

- Mini-game tasks are mostly physical challenges (push-ups, dance) rather than intimate activities
- Tagged with "visual" or "teasing" where appropriate
- Focus Mode works best with scratch-card, spin-wheel, and would-you-rather activities
- The "ass" category needs more explicit content in the data files to be properly represented
