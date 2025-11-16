import { Punishment, Difficulty, ActivityType } from '../types/game.types';

/**
 * Load punishments from JSON file based on difficulty and activity
 */
export async function loadPunishments(
  difficulty: Difficulty,
  activity: ActivityType
): Promise<Punishment[]> {
  try {
    // Construct the file path
    const fileName = `${activity}.json`;
    const filePath = `/data/punishments/${difficulty}/${fileName}`;

    // Fetch the JSON file
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to load punishments: ${response.statusText}`);
    }

    const data: Punishment[] = await response.json();

    // Validate the data
    if (!Array.isArray(data)) {
      throw new Error('Invalid punishment data format');
    }

    console.log(`📥 Loaded punishments from ${filePath}:`, data.length, 'items');
    console.log('Sample:', data.slice(0, 2).map(p => ({ id: p.id, difficulty: p.difficulty, desc: p.description })));

    // Filter to ensure we only get punishments matching the difficulty and activity
    const filtered = data.filter(
      (p) => p.difficulty === difficulty && p.activity === activity
    );

    console.log(`✅ After filtering for difficulty="${difficulty}" and activity="${activity}":`, filtered.length, 'items');
    
    if (filtered.length === 0) {
      console.warn(`⚠️ No punishments matched! Check that JSON has correct difficulty and activity fields`);
    }

    return filtered;
  } catch (error) {
    console.error('Error loading punishments:', error);
    
    // Return fallback punishments if loading fails
    return getFallbackPunishments(difficulty, activity);
  }
}

/**
 * Fallback punishments in case JSON loading fails
 */
function getFallbackPunishments(
  difficulty: Difficulty,
  activity: ActivityType
): Punishment[] {
  const basePunishments: Punishment[] = [
    {
      id: 1,
      description: 'Do 5 jumping jacks',
      gender: 'male',
      difficulty,
      activity,
      timer: 30
    },
    {
      id: 2,
      description: 'Sing a verse from a song',
      gender: 'female',
      difficulty,
      activity,
      timer: 30
    },
    {
      id: 3,
      description: 'Strike a funny pose for 10 seconds',
      gender: 'male',
      difficulty,
      activity,
      timer: 10
    },
    {
      id: 4,
      description: 'Tell a joke',
      gender: 'female',
      difficulty,
      activity,
      timer: 0
    }
  ];

  return basePunishments;
}

/**
 * Preload all punishment files for better performance
 */
export async function preloadAllPunishments(): Promise<void> {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const activities: ActivityType[] = ['mini-game', 'scratch-card', 'spin-wheel', 'body-explorer'];

  const promises = difficulties.flatMap((difficulty) =>
    activities.map((activity) => loadPunishments(difficulty, activity))
  );

  try {
    await Promise.all(promises);
    console.log('All punishments preloaded successfully');
  } catch (error) {
    console.warn('Some punishments failed to preload:', error);
  }
}
