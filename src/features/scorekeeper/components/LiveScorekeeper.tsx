import { useState } from 'react';
import IceRink from './IceRink';
import ActionBar from './ActionBar';
import StoppageMenu from './StoppageMenu';
import FaceoffOverlay from './FaceoffOverlay';
import GoalForm from './GoalForm';
import PenaltyForm from './PenaltyForm';
import GameLog, { type GameEvent } from './GameLog';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

type Props = {
  gameId: string;
  onExit: () => void;
};

export default function LiveScorekeeper({ gameId, onExit }: Props) {
  const [isMirrored, setIsMirrored] = useState(false);
  const [clockRunning, setClockRunning] = useState(false);
  const [showStoppageMenu, setShowStoppageMenu] = useState(false);
  const [showFaceoffOverlay, setShowFaceoffOverlay] = useState(true); // Game starts with faceoff

  const [activeForm, setActiveForm] = useState<{type: 'goal' | 'penalty', team: 'home' | 'away'} | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);

  // Mock stats
  const homeScore = 0;
  const awayScore = 0;
  const homeSOG = 0;
  const awaySOG = 0;
  const homePIM = 0;
  const awayPIM = 0;
  const currentPeriod = 1;
  const timeRemaining = "20:00";

  const addEvent = async (type: string, team: 'home' | 'away' | undefined, details: string, dbPayload: any = {}) => {
    try {
      const payload = {
        game_id: gameId,
        timestamp: new Date().toISOString(),
        event_status: 'VALID',
        period: currentPeriod,
        time_in_period: timeRemaining,
        event_type: type,
        ...dbPayload
      };

      const docRef = await addDoc(collection(db, 'games', gameId, 'game_events'), payload);

      setEvents(prev => [...prev, {
        id: docRef.id,
        type,
        team,
        period: currentPeriod,
        time_in_period: timeRemaining,
        details,
        status: 'VALID'
      }]);
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  const toggleEventStatus = async (eventId: string) => {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;

    const newStatus = ev.status === 'VALID' ? 'DELETED' : 'VALID';

    try {
      await updateDoc(doc(db, 'games', gameId, 'game_events', eventId), {
        event_status: newStatus
      });
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const handleIceClick = (x: number, y: number) => {
    console.log(`Ice clicked at X: ${x.toFixed(3)}, Y: ${y.toFixed(3)}`);
    // Simple mock logic: left side is home attack (away save), right side is away attack (home save)
    const team = x < 0.5 ? 'away' : 'home';
    addEvent('SHOT', team, `Shot on goal (x:${x.toFixed(2)}, y:${y.toFixed(2)})`, {
      coord_x: x,
      coord_y: y
    });
  };

  const handleActionClick = () => {
    if (clockRunning) {
      setClockRunning(false);
      setShowStoppageMenu(true);
    } else {
      setShowStoppageMenu(true);
    }
  };

  const handleStoppageAction = (action: string) => {
    setShowStoppageMenu(false);
    if (action === 'FACEOFF') {
      setShowFaceoffOverlay(true);
    } else if (action === 'UNDO_STOPPAGE') {
      setClockRunning(true);
    } else if (action === 'GOAL_HOME') {
      setActiveForm({ type: 'goal', team: 'home' });
    } else if (action === 'GOAL_AWAY') {
      setActiveForm({ type: 'goal', team: 'away' });
    } else if (action === 'PENALTY_HOME') {
      setActiveForm({ type: 'penalty', team: 'home' });
    } else if (action === 'PENALTY_AWAY') {
      setActiveForm({ type: 'penalty', team: 'away' });
    } else {
      console.log('Action selected:', action);
      setTimeout(() => setShowStoppageMenu(true), 500);
    }
  };

  const handleFormSave = (data: any) => {
    if (data.type === 'GOAL') {
      const details = `Scorer: ${data.scorer}` + (data.assist1 ? `, Ast: ${data.assist1}` : '') + (data.assist2 ? `, Ast2: ${data.assist2}` : '');
      addEvent('GOAL', data.team, details, { primary_person_id: data.scorer });
    } else if (data.type === 'PENALTY') {
      addEvent('PENALTY', data.team, `${data.minutes} min - ${data.penaltyType}`, { primary_person_id: data.player, penalty_type: data.penaltyType, penalty_minutes: data.minutes });
    }

    setActiveForm(null);
    setShowStoppageMenu(true);
  };

  const handleFormCancel = () => {
    setActiveForm(null);
    setShowStoppageMenu(true);
  };

  const handleFaceoffWin = (teamId: 'home' | 'away') => {
    addEvent('FACEOFF', teamId, `${teamId.toUpperCase()} won faceoff`);
    setShowFaceoffOverlay(false);
    setClockRunning(true);
  };

  return (
    <div className="h-screen w-full bg-[#18181b] text-white flex flex-col fixed inset-0 z-50 overflow-hidden font-sans select-none">

      {/* Header (max 15%) */}
      <div className="h-[12%] min-h-[80px] bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shadow-md z-10">

        {/* Home */}
        <div className="flex flex-col items-start w-1/3">
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="text-xl font-bold tracking-wider">HOME</span>
          </div>
          <div className="flex space-x-4 text-zinc-400 text-sm font-semibold">
            <span>SOG: <span className="text-white">{homeSOG}</span></span>
            <span>PIM: <span className="text-white">{homePIM}</span></span>
          </div>
        </div>

        {/* Center Clock */}
        <div className="flex flex-col items-center justify-center w-1/3">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Periode {currentPeriod}</span>
          <div className="text-5xl font-mono font-bold text-[#FFEFD5] tabular-nums tracking-tighter">
            {timeRemaining}
          </div>
        </div>

        {/* Away */}
        <div className="flex flex-col items-end w-1/3">
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-xl font-bold tracking-wider">AWAY</span>
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </div>
          <div className="flex space-x-4 text-zinc-400 text-sm font-semibold">
            <span>SOG: <span className="text-white">{awaySOG}</span></span>
            <span>PIM: <span className="text-white">{awayPIM}</span></span>
          </div>
        </div>
      </div>

      {/* Score bar underneath header (optional, but requested implicitly by having a score) */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 bg-zinc-900 px-6 py-2 rounded-b-2xl border-x border-b border-zinc-800 flex items-center space-x-8 shadow-xl z-20">
        <span className="text-3xl font-bold">{homeScore}</span>
        <span className="text-zinc-600 font-bold">-</span>
        <span className="text-3xl font-bold">{awayScore}</span>
      </div>

      {/* Ice Rink Area */}
      <div className="flex-1 relative z-0">
        <IceRink onIceClick={handleIceClick} isMirrored={isMirrored} />
      </div>

      {/* Game Log */}
      <GameLog events={events} onToggleStatus={toggleEventStatus} />

      {/* Swipeable Action Bar */}
      <ActionBar
        onMirror={() => setIsMirrored(!isMirrored)}
        onUndo={() => console.log('undo')}
        onRedo={() => console.log('redo')}
        onOptions={onExit} // temp exit binding
      />

      {/* Main Action Button */}
      <div className="bg-zinc-950 p-4 pb-8 flex justify-center z-10 border-t border-zinc-900">
        <button
          onClick={handleActionClick}
          className={`
            w-full max-w-sm py-5 rounded-2xl text-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95
            ${clockRunning
              ? 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/50'
              : 'bg-[#FFEFD5] text-zinc-900 hover:bg-yellow-100 shadow-yellow-900/20'
            }
          `}
        >
          {clockRunning ? 'Stop Klok' : 'Faceoff / Hervat'}
        </button>
      </div>

      {/* Overlays */}
      {showStoppageMenu && (
        <StoppageMenu
          onClose={() => setShowStoppageMenu(false)}
          onSelectAction={handleStoppageAction}
        />
      )}

      {showFaceoffOverlay && (
        <FaceoffOverlay onWin={handleFaceoffWin} />
      )}

      {activeForm?.type === 'goal' && (
        <GoalForm team={activeForm.team} onSave={handleFormSave} onCancel={handleFormCancel} />
      )}

      {activeForm?.type === 'penalty' && (
        <PenaltyForm team={activeForm.team} onSave={handleFormSave} onCancel={handleFormCancel} />
      )}

    </div>
  );
}