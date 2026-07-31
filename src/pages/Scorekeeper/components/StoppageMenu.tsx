type StoppageMenuProps = {
  onClose: () => void;
  onSelectAction: (action: string) => void;
};

export default function StoppageMenu({ onClose, onSelectAction }: StoppageMenuProps) {
  const actions = [
    { id: 'FACEOFF', label: 'Faceoff & spel hervatten' },
    { id: 'GOAL_HOME', label: 'Goal Home' },
    { id: 'GOAL_AWAY', label: 'Goal Away' },
    { id: 'PENALTY_HOME', label: 'Penalty Home' },
    { id: 'PENALTY_AWAY', label: 'Penalty Away' },
    { id: 'ICING', label: 'Icing' },
    { id: 'OFFSIDE', label: 'Offside' },
    { id: 'OTHER', label: 'Anders (omschrijf kort)' },
    { id: 'UNDO_STOPPAGE', label: 'Wedstrijd stilleggen ongedaan maken', isDanger: true },
  ];

  return (
    <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col space-y-3">
        <h3 className="text-xl font-bold text-center text-white mb-2">Spelonderbreking</h3>

        {actions.map(a => (
          <button
            key={a.id}
            onClick={() => onSelectAction(a.id)}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-colors
              ${a.isDanger
                ? 'bg-zinc-800 text-red-400 hover:bg-zinc-700 border border-red-900/30'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'}
              ${a.id === 'FACEOFF' ? 'bg-[#FFEFD5] text-zinc-900 hover:bg-yellow-100' : ''}
            `}
          >
            {a.label}
          </button>
        ))}

        <button
          onClick={onClose}
          className="mt-4 text-zinc-500 font-semibold py-2 hover:text-white"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}