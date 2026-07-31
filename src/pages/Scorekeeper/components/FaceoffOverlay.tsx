type FaceoffOverlayProps = {
  onWin: (teamId: 'home' | 'away') => void;
};

export default function FaceoffOverlay({ onWin }: FaceoffOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/80 z-40 flex flex-col items-center justify-center backdrop-blur-md">
      <h2 className="text-4xl font-black text-white mb-12 uppercase tracking-widest text-center">
        Wie wint de<br/><span className="text-[#FFEFD5]">Faceoff?</span>
      </h2>

      <div className="flex space-x-12 w-full max-w-2xl px-8">

        {/* Home */}
        <button
          onClick={() => onWin('home')}
          className="flex-1 aspect-square bg-zinc-900 border-4 border-blue-500 rounded-3xl flex flex-col items-center justify-center active:scale-95 transition-transform shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:bg-zinc-800"
        >
          <div className="w-16 h-16 rounded-full bg-blue-500 mb-4" />
          <span className="text-2xl font-bold text-white">HOME</span>
        </button>

        {/* Away */}
        <button
          onClick={() => onWin('away')}
          className="flex-1 aspect-square bg-zinc-900 border-4 border-red-500 rounded-3xl flex flex-col items-center justify-center active:scale-95 transition-transform shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:bg-zinc-800"
        >
          <div className="w-16 h-16 rounded-full bg-red-500 mb-4" />
          <span className="text-2xl font-bold text-white">AWAY</span>
        </button>

      </div>
    </div>
  );
}