import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase';

export async function forceSeedDatabase() {
  try {
    const compRef = doc(db, 'competitions', 'COMP_001');

    // Force delete to trigger re-seed
    await deleteDoc(compRef);

    console.log('Deleted old comp to force reseed...');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
