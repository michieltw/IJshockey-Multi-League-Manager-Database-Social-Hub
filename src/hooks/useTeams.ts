import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type Team = {
  id: string;
  name: string;
  org_id?: string;
  code?: string;
  [key: string]: any;
};

/**
 * Custom hook to fetch and optionally cache teams.
 * In a larger scale app, you might want to use a state management library
 * (like React Query or Redux) or React Context to cache this globally.
 */
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true);
        // Ordering by name ensures consistent UI dropdowns
        const q = query(collection(db, 'teams'), orderBy('name', 'asc'));
        const snap = await getDocs(q);
        const fetchedTeams = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Team));

        setTeams(fetchedTeams);
      } catch (err: any) {
        console.error("Error fetching teams:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return { teams, loading, error };
}
