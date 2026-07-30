import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function seedDatabase() {
  try {
    const compRef = doc(db, 'competitions', 'COMP_001');
    const compSnap = await getDoc(compRef);

    if (compSnap.exists()) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database...');

    // Competitie
    await setDoc(compRef, {
      name: "GIJS House League",
      season: "2026/2027",
      settings: {
        pointsForWin: 2,
        pointsForLoss: 0,
        pointsForOTLoss: 1,
        pointsForTie: 1,
        trackShots: false
      }
    });

    // Teams Divisie A
    const teams = [
      { id: 'T_001', name: 'Polar Bears', division: 'A', color: 'bg-blue-600' },
      { id: 'T_002', name: 'Grizzlies', division: 'A', color: 'bg-green-600' },
      { id: 'T_003', name: 'Kodiaks', division: 'A', color: 'bg-red-600' },
      { id: 'T_004', name: 'Ice Hounds', division: 'B', color: 'bg-indigo-600' },
      { id: 'T_005', name: 'Snow Leopards', division: 'B', color: 'bg-purple-600' }
    ];

    for (const team of teams) {
      await setDoc(doc(db, 'teams', team.id), team);
    }

    // Seed een fake game
    await setDoc(doc(db, 'games', 'GAME_001'), {
      competitionId: 'COMP_001',
      homeTeamId: 'T_001',
      awayTeamId: 'T_002',
      homeScore: 3,
      awayScore: 2,
      isOvertime: true,
      status: 'FINAL',
      date: new Date().toISOString()
    });

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
