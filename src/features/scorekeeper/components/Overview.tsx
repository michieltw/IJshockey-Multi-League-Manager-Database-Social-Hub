import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useTeams } from '../../../hooks/useTeams';

type Props = {
  onStartGame: (gameId: string) => void;
};

export default function Overview({ onStartGame }: Props) {
  const [showSetup, setShowSetup] = useState(false);
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam) return alert('Selecteer beide teams');
    if (homeTeam === awayTeam) return alert('Thuis en uit team kunnen niet hetzelfde zijn');

    setSubmitting(true);
    try {
      const newGameRef = await addDoc(collection(db, 'games'), {
        season_id: 'SZN_CURRENT',
        home_team_id: homeTeam,
        away_team_id: awayTeam,
        record_type: 'OFFICIAL',
        status: 'LIVE',
        clock_running: false,
        current_period: 1,
        time_remaining: '20:00',
        score: [0, 0],
        shots_on_goal: [0, 0],
        start_time: new Date().toISOString()
      });
      onStartGame(newGameRef.id);
    } catch (err) {
      console.error(err);
      alert('Fout bij aanmaken wedstrijd');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900 text-zinc-100 font-sans">
      <div className="p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-6 text-[#FFEFD5]">Scorekeeper Module</h1>

        <div className="space-y-6 text-lg leading-relaxed mb-12">
          <section className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">Bediening & Registratie</h2>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Alle gebeurtenissen worden geregistreerd via de <strong>interactieve ijsvloer</strong>.</li>
              <li>Tik op het ijs om een schot of actie te registreren. De positie wordt exact opgeslagen.</li>
              <li>Gebruik de <strong>Action Button</strong> onderaan het scherm om de klok te pauzeren en spelonderbrekingen (zoals goals, penalties of icings) te loggen.</li>
              <li>Het spel wordt hervat door een faceoff te registreren.</li>
            </ul>
          </section>

          <section className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">Aandachtspunten & Gestures</h2>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Pinch-to-zoom en pannen zijn beschikbaar om in te zoomen op specifieke zones van het ijs.</li>
              <li>Alle acties in de Game Log kunnen worden bewerkt of ongedaan gemaakt (Undo/Redo).</li>
              <li><strong className="text-red-400">Waarschuwing:</strong> Correcte registratie is essentieel. Deze data voedt direct de statistieken en standen van de gehele league. Werk nauwkeurig!</li>
            </ul>
          </section>
        </div>

        {!showSetup ? (
          <button
            onClick={() => setShowSetup(true)}
            className="w-full py-6 bg-[#FFEFD5] text-zinc-900 text-2xl font-bold rounded-2xl shadow-lg hover:bg-yellow-100 transition-colors uppercase tracking-wider"
          >
            Start Scorekeeper
          </button>
        ) : (
          <div className="bg-zinc-800 p-8 rounded-2xl border border-zinc-700 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-bold mb-6 text-white">Wedstrijd Instellen</h3>
            <form onSubmit={handleStart} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-zinc-400 mb-2">Thuisploeg</label>
                  {teamsLoading ? (
                    <div className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-500 animate-pulse">Laden...</div>
                  ) : teamsError ? (
                    <div className="w-full p-4 bg-zinc-900 border border-red-500/50 rounded-xl text-red-400">Fout bij laden teams</div>
                  ) : (
                    <select
                      className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-[#FFEFD5]"
                      value={homeTeam}
                      onChange={e => setHomeTeam(e.target.value)}
                      required
                    >
                      <option value="">Selecteer thuisteam...</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-400 mb-2">Uitploeg</label>
                  {teamsLoading ? (
                    <div className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-500 animate-pulse">Laden...</div>
                  ) : teamsError ? (
                    <div className="w-full p-4 bg-zinc-900 border border-red-500/50 rounded-xl text-red-400">Fout bij laden teams</div>
                  ) : (
                    <select
                      className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-[#FFEFD5]"
                      value={awayTeam}
                      onChange={e => setAwayTeam(e.target.value)}
                      required
                    >
                      <option value="">Selecteer uitteam...</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  )}
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSetup(false)}
                  className="px-6 py-4 rounded-xl font-bold text-zinc-300 hover:bg-zinc-700 transition-colors w-1/3"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={submitting || teamsLoading}
                  className="flex-1 py-4 bg-[#FFEFD5] text-zinc-900 font-bold rounded-xl hover:bg-yellow-100 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Aanmaken...' : 'Start Wedstrijd'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}