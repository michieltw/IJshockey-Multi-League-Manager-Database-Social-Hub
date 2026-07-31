import { Trash2 } from 'lucide-react';

export type GameEvent = {
  id: string;
  type: string; // GOAL, PENALTY, FACEOFF, SHOT, etc
  team?: 'home' | 'away';
  period: number;
  time_in_period: string;
  details: string;
  status: 'VALID' | 'DELETED';
};

type GameLogProps = {
  events: GameEvent[];
  onToggleStatus: (id: string) => void;
};

export default function GameLog({ events, onToggleStatus }: GameLogProps) {
  return (
    <div className="h-48 bg-zinc-900 border-t border-zinc-800 overflow-y-auto flex flex-col z-10 p-2 space-y-1">
      {events.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-zinc-500 font-semibold">
          Nog geen gebeurtenissen...
        </div>
      )}
      {[...events].reverse().map(ev => {
        const isDeleted = ev.status === 'DELETED';
        const teamColor = ev.team === 'home' ? 'text-blue-400' : ev.team === 'away' ? 'text-red-400' : 'text-zinc-300';

        return (
          <div key={ev.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDeleted ? 'bg-zinc-950 border-zinc-900 opacity-50' : 'bg-zinc-800 border-zinc-700'}`}>
            <div className="flex items-center space-x-4">
              <span className="font-mono text-zinc-400 w-12 text-sm">{ev.time_in_period}</span>
              <span className={`font-bold uppercase text-xs w-16 ${teamColor}`}>
                {ev.type}
              </span>
              <span className={`text-sm ${isDeleted ? 'line-through text-zinc-600' : 'text-white'}`}>
                {ev.details}
              </span>
            </div>

            <button
              onClick={() => onToggleStatus(ev.id)}
              className={`p-2 rounded-lg transition-colors ${isDeleted ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-red-400 hover:bg-red-900/20'}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}