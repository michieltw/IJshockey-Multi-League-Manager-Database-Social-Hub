import React, { useState } from 'react';

// Using mock player data, this should normally be fetched from the database
const MOCK_PLAYERS = [
  { id: 'p1', number: 8, name: 'De Jong' },
  { id: 'p2', number: 10, name: 'Bakker' },
  { id: 'p3', number: 14, name: 'Visser' },
  { id: 'p4', number: 19, name: 'Smit' },
  { id: 'p5', number: 77, name: 'Meijer' },
];

type GoalFormProps = {
  team: 'home' | 'away';
  onSave: (data: any) => void;
  onCancel: () => void;
};

export default function GoalForm({ team, onSave, onCancel }: GoalFormProps) {
  const [scorer, setScorer] = useState('');
  const [assist1, setAssist1] = useState('');
  const [assist2, setAssist2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scorer) return alert('Selecteer tenminste een doelpuntenmaker');
    onSave({ type: 'GOAL', team, scorer, assist1, assist2 });
  };

  const btnColor = team === 'home' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500';

  return (
    <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col">
        <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-wider text-center">
          Goal <span className={team === 'home' ? 'text-blue-500' : 'text-red-500'}>{team.toUpperCase()}</span>
        </h3>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">Doelpuntenmaker</label>
            <select
              value={scorer}
              onChange={e => setScorer(e.target.value)}
              className="w-full p-4 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-white text-lg font-bold focus:border-[#FFEFD5] focus:outline-none"
              required
            >
              <option value="">Selecteer speler...</option>
              {MOCK_PLAYERS.map(p => <option key={p.id} value={p.id}>#{p.number} {p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">Assist 1 (Optioneel)</label>
            <select
              value={assist1}
              onChange={e => setAssist1(e.target.value)}
              className="w-full p-4 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-white text-lg font-bold focus:border-[#FFEFD5] focus:outline-none"
            >
              <option value="">Geen assist</option>
              {MOCK_PLAYERS.filter(p => p.id !== scorer).map(p => <option key={p.id} value={p.id}>#{p.number} {p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">Assist 2 (Optioneel)</label>
            <select
              value={assist2}
              onChange={e => setAssist2(e.target.value)}
              className="w-full p-4 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-white text-lg font-bold focus:border-[#FFEFD5] focus:outline-none"
            >
              <option value="">Geen assist</option>
              {MOCK_PLAYERS.filter(p => p.id !== scorer && p.id !== assist1).map(p => <option key={p.id} value={p.id}>#{p.number} {p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 bg-zinc-800 rounded-xl font-bold text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Annuleren
          </button>
          <button
            type="submit"
            className={`flex-1 py-4 rounded-xl font-black text-white transition-colors ${btnColor}`}
          >
            Sla Goal Op
          </button>
        </div>
      </form>
    </div>
  );
}