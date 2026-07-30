import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function seedDatabase() {
  try {
    const compRef = doc(db, 'competitions', 'COMP_001');
    const compSnap = await getDoc(compRef);

    if (compSnap.exists()) {
       // Allow force reseeding for demo purposes if team logos aren't there yet
       // but just do it safely
    }

    console.log('Seeding database...');

    // Global Settings (Main Logo)
    await setDoc(doc(db, 'settings', 'global'), {
      main_logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Groningen_GIJS_Bear_Logo.png/640px-Groningen_GIJS_Bear_Logo.png"
    });

    // Competitie
    await setDoc(compRef, {
      name: "GIJS House League",
      season: "2026/2027",
      league_logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Groningen_GIJS_Bear_Logo.png/640px-Groningen_GIJS_Bear_Logo.png",
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
      { id: 'T_001', name: 'Polar Bears', division: 'A', color: 'bg-blue-600', team_logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Chicago_Bears_logo.svg/1200px-Chicago_Bears_logo.svg.png" },
      { id: 'T_002', name: 'Grizzlies', division: 'A', color: 'bg-green-600', team_logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Chicago_Bears_logo.svg/1200px-Chicago_Bears_logo.svg.png" },
      { id: 'T_003', name: 'Kodiaks', division: 'A', color: 'bg-red-600', team_logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Chicago_Bears_logo.svg/1200px-Chicago_Bears_logo.svg.png" },
      { id: 'T_004', name: 'Ice Hounds', division: 'B', color: 'bg-indigo-600', team_logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Chicago_Bears_logo.svg/1200px-Chicago_Bears_logo.svg.png" },
      { id: 'T_005', name: 'Snow Leopards', division: 'B', color: 'bg-purple-600', team_logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Chicago_Bears_logo.svg/1200px-Chicago_Bears_logo.svg.png" }
    ];

    for (const team of teams) {
      await setDoc(doc(db, 'teams', team.id), team);
    }

    // Spelers / Personen
    const persons = [
      { id: 'PERS_001', name_first: 'Jan', name_last: 'Jansen', player_headshot_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png", person_photo_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" },
      { id: 'PERS_002', name_first: 'Piet', name_last: 'Pietersen', player_headshot_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png", person_photo_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" }
    ];

    for (const person of persons) {
      await setDoc(doc(db, 'persons', person.id), person);
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
