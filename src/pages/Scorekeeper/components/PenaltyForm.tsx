import React, { useState } from 'react';

const MOCK_PLAYERS = [
  { id: 'p1', number: 8, name: 'De Jong' },
  { id: 'p2', number: 10, name: 'Bakker' },
  { id: 'p3', number: 14, name: 'Visser' },
  { id: 'p4', number: 19, name: 'Smit' },
  { id: 'p5', number: 77, name: 'Meijer' },
];

const PENALTY_TYPES = [
  { id: 'TRIP', label: 'Tripping', mins: 2 },
  { id: 'HOOK', label: 'Hooking', mins: 2 },
  { id: 'SLASH', label: 'Slashing', mins: 2 },
  { id: 'ROUGH', label: 'Roughing', mins: 2 },
  { id: 'BOARD', label: 'Boarding', mins: 2 },
  { id: 'FIGHT', label: 'Fighting', mins: 5 },
  { id: 'MISC', label: 'Misconduct', mins: 10 },
];

type PenaltyFormProps = {
  team: 'home' | 'away';
  onSave: (data: any) => void;
  onCancel: () => void;
};

export default function PenaltyForm({ team, onSave, onCancel }: PenaltyFormProps) {
  const [player, setPlayer] = useState('');
  const [typeId, setTypeId] = useState('');
  const [minutes, setMinutes] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!player || !typeId) return alert('Vul speler en strafsoort in');
    onSave({ type: 'PENALTY', team, player, penaltyType: typeId, minutes });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTypeId(val);
    const ptype = PENALTY_TYPES.find(pt => pt.id === val);
    if (ptype) setMinutes(ptype.mins);
  };

  const btnColor = team === 'home' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500';

  return (
    <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col">
        <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-wider text-center">
          Penalty <span className={team === 'home' ? 'text-blue-500' : 'text-red-500'}>{team.toUpperCase()}</span>
        </h3>

        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">Overtreder</label>
            <select
              value={player}
              onChange={e => setPlayer(e.target.value)}
              className="w-full p-4 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-white text-lg font-bold focus:border-[#FFEFD5] focus:outline-none"
              required
            >
              <option value="">Selecteer speler...</option>
              {MOCK_PLAYERS.map(p => <option key={p.id} value={p.id}>#{p.number} {p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">Strafsoort</label>
            <select
              value={typeId}
              onChange={handleTypeChange}
              className="w-full p-4 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-white text-lg font-bold focus:border-[#FFEFD5] focus:outline-none"
              required
            >
              <option value="">Kies reden...</option>
              {PENALTY_TYPES.map(pt => <option key={pt.id} value={pt.id}>{pt.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">Duur (Minuten)</label>
            <div className="flex space-x-2">
              {[2, 4, 5, 10].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(m)}
                  className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors border-2 ${minutes === m ? 'border-[#FFEFD5] bg-[#FFEFD5] text-zinc-900' : 'border-zinc-700 bg-zinc-800 text-white'}`}
                >
                  {m}
                </button>
              ))}
            </div>
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
            Sla Straf Op
          </button>
        </div>
      </form>
    </div>
  );
}