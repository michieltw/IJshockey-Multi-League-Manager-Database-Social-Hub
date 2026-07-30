import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Topbar from '../components/Topbar';

type Team = { id: string; name: string; division: string };

export default function Scorekeeper() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [isOvertime, setIsOvertime] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTeams() {
      const snap = await getDocs(collection(db, 'teams'));
      setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() } as Team)));
    }
    loadTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam) return alert('Selecteer beide teams');

    setSaving(true);
    try {
      const gameId = `GAME_${Date.now()}`;
      await setDoc(doc(db, 'games', gameId), {
        competitionId: 'COMP_001',
        homeTeamId: homeTeam,
        awayTeamId: awayTeam,
        homeScore,
        awayScore,
        isOvertime,
        status: 'FINAL',
        date: new Date().toISOString()
      });
      alert('Wedstrijd opgeslagen!');
      setHomeScore(0);
      setAwayScore(0);
      setIsOvertime(false);
    } catch (err) {
      console.error(err);
      alert('Fout bij opslaan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Topbar
        title="Scorekeeper"
        subtitle="Voer wedstrijdresultaten in"
        navItems={[{ label: 'Invoer', to: '/modules/scorekeeper' }]}
      />
      <div className="p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-2 gap-8">
              {/* Home */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Thuis (Home)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  value={homeTeam}
                  onChange={e => setHomeTeam(e.target.value)}
                  required
                >
                  <option value="">Selecteer team...</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name} (Div {t.division})</option>)}
                </select>
                <div className="text-center">
                  <label className="block text-xs text-gray-500 uppercase mb-1">Score</label>
                  <input
                    type="number"
                    value={homeScore}
                    onChange={e => setHomeScore(Number(e.target.value))}
                    className="w-24 text-center text-4xl p-2 border border-gray-300 rounded font-bold"
                    min="0"
                  />
                </div>
              </div>

              {/* Away */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Uit (Away)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  value={awayTeam}
                  onChange={e => setAwayTeam(e.target.value)}
                  required
                >
                  <option value="">Selecteer team...</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name} (Div {t.division})</option>)}
                </select>
                <div className="text-center">
                  <label className="block text-xs text-gray-500 uppercase mb-1">Score</label>
                  <input
                    type="number"
                    value={awayScore}
                    onChange={e => setAwayScore(Number(e.target.value))}
                    className="w-24 text-center text-4xl p-2 border border-gray-300 rounded font-bold"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
              <input
                type="checkbox"
                id="ot"
                checked={isOvertime}
                onChange={e => setIsOvertime(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="ot" className="text-sm font-medium text-gray-700">Beslist in Overtime / Shootout</label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? 'Bezig met opslaan...' : 'Sla Wedstrijd Op (FINAL)'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
