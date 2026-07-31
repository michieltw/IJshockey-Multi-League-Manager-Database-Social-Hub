import { RotateCw, FlipHorizontal, Undo2, Redo2, Settings } from 'lucide-react';

type ActionBarProps = {
  onMirror: () => void;
  onRotate?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onOptions: () => void;
};

export default function ActionBar({ onMirror, onRotate, onUndo, onRedo, onOptions }: ActionBarProps) {
  const btnClass = "flex flex-col items-center justify-center p-3 text-zinc-400 hover:text-[#FFEFD5] hover:bg-zinc-800 rounded-xl transition-colors min-w-[80px]";

  return (
    <div className="w-full bg-zinc-900 border-t border-zinc-800 p-2 overflow-x-auto touch-pan-x no-scrollbar">
      <div className="flex space-x-2 w-max mx-auto px-4">
        <button onClick={onOptions} className={btnClass}>
          <Settings size={24} className="mb-1" />
          <span className="text-xs font-semibold">Opties</span>
        </button>
        <div className="w-px h-10 bg-zinc-800 self-center mx-2" />
        <button onClick={onUndo} className={btnClass}>
          <Undo2 size={24} className="mb-1" />
          <span className="text-xs font-semibold">Undo</span>
        </button>
        <button onClick={onRedo} className={btnClass}>
          <Redo2 size={24} className="mb-1" />
          <span className="text-xs font-semibold">Redo</span>
        </button>
        <div className="w-px h-10 bg-zinc-800 self-center mx-2" />
        <button onClick={onMirror} className={btnClass}>
          <FlipHorizontal size={24} className="mb-1" />
          <span className="text-xs font-semibold">Spiegel</span>
        </button>
        <button onClick={onRotate} className={btnClass}>
          <RotateCw size={24} className="mb-1" />
          <span className="text-xs font-semibold">Draai</span>
        </button>
      </div>
    </div>
  );
}