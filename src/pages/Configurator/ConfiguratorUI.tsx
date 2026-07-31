import React from 'react';
import type { StickConfig } from './types';
import { Plus, Zap, Check, ShoppingCart } from 'lucide-react';

interface ConfiguratorUIProps {
  config: StickConfig;
  setConfig: React.Dispatch<React.SetStateAction<StickConfig>>;
  onShoot: (type: 'slapshot' | 'wristshot') => void;
  isAnimatingFlex: boolean;
  onSave: () => void;
}

const COLORS = [
  { name: 'Black', hex: '#0f172a' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' },
];

const CURVE_INFO: Record<string, string> = {
  P92: 'Allround, snelle polsschoten.',
  P28: 'Diepe bocht, makkelijk liften.',
  P88: 'Vlak blad, strakke passing.',
  PM9: 'Lichte bocht, passing-gericht.',
  P02: 'Brede, open curve, krachtig.',
  P08: 'Sterke kromming, maximaal effect.',
  P91A: 'Open blad, tip-ins en rebounds.',
  P14: 'Compact, stickhandling in kleine ruimtes.'
};

export function ConfiguratorUI({ config, setConfig, onShoot, isAnimatingFlex, onSave }: ConfiguratorUIProps) {

  const calculatePrice = () => {
    let base = 139.00;
    if (config.carbon === '18K Carbon') base = 159.00;
    if (config.carbon === 'Full Carbon') base = 119.00;
    if (config.length === 'Junior (52")') base -= 20;
    if (config.length === 'Intermediate (57")') base -= 10;
    return base;
  };

  return (
    <div className="absolute inset-y-0 right-0 w-80 bg-slate-900/80 backdrop-blur-md border-l border-white/10 text-white p-6 overflow-y-auto custom-scrollbar shadow-2xl z-10 flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <Zap className="text-sky-400 w-6 h-6" />
          Blackout
        </h2>
        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-bold">Custom Stick Builder</p>
      </div>

      <div className="flex-grow space-y-8">

        {/* Handedness */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Handedness</label>
          <div className="flex gap-2">
            {['Left', 'Right'].map(hand => (
              <button
                key={hand}
                onClick={() => setConfig({ ...config, handedness: hand as any })}
                className={`flex-1 py-2 text-xs font-bold rounded border transition-all ${
                  config.handedness === hand ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {hand}
              </button>
            ))}
          </div>
        </div>

        {/* Carbon */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carbon Type</label>
          <div className="flex flex-col gap-2">
            {['18K Carbon', '12K Carbon', 'Full Carbon'].map(carb => (
              <button
                key={carb}
                onClick={() => setConfig({ ...config, carbon: carb as any })}
                className={`w-full py-2 px-3 text-left text-xs font-bold rounded border transition-all ${
                  config.carbon === carb ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {carb}
              </button>
            ))}
          </div>
        </div>

        {/* Flex */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flex</label>
          <div className="grid grid-cols-2 gap-2">
            {[65, 75, 85, 95].map(fl => (
              <button
                key={fl}
                onClick={() => setConfig({ ...config, flex: fl as any })}
                className={`py-2 text-xs font-bold rounded border transition-all ${
                  config.flex === fl ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {fl}
              </button>
            ))}
          </div>
        </div>

        {/* Curve */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blade Curve</label>
          <div className="grid grid-cols-4 gap-2">
            {['P92', 'P28', 'P88', 'PM9', 'P02', 'P08', 'P91A', 'P14'].map(cr => (
              <button
                key={cr}
                onClick={() => setConfig({ ...config, curve: cr as any })}
                className={`py-2 text-[10px] font-bold rounded border transition-all ${
                  config.curve === cr ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cr}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-sky-300 italic">{CURVE_INFO[config.curve]}</p>
        </div>

        {/* Kick Point */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kick Point</label>
          <div className="flex gap-2">
            {['Low', 'Mid', 'High'].map(kp => (
              <button
                key={kp}
                onClick={() => setConfig({ ...config, kickPoint: kp as any })}
                className={`flex-1 py-2 text-[10px] font-bold rounded border transition-all ${
                  config.kickPoint === kp ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {kp}
              </button>
            ))}
          </div>
        </div>

        {/* Length */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stick Length</label>
          <div className="flex gap-2">
            {['Senior (60")', 'Intermediate (57")', 'Junior (52")'].map(ln => (
              <button
                key={ln}
                onClick={() => setConfig({ ...config, length: ln as any })}
                className={`flex-1 py-2 text-[10px] font-bold rounded border transition-all ${
                  config.length === ln ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {ln.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Grip */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shaft Grip</label>
          <div className="flex gap-2">
            {['Grip Finish', 'Matte Finish'].map(grip => (
              <button
                key={grip}
                onClick={() => setConfig({ ...config, grip: grip as any })}
                className={`flex-1 py-2 text-[10px] font-bold rounded border transition-all ${
                  config.grip === grip ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {grip.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stick Color</label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map(color => (
              <button
                key={color.name}
                onClick={() => setConfig({ ...config, color: color.hex })}
                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                  config.color === color.hex ? 'border-sky-400 scale-110 shadow-[0_0_10px_rgba(56,189,248,0.5)]' : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {config.color === color.hex && <Check className="w-4 h-4 text-white drop-shadow-md" />}
              </button>
            ))}
            <div className="relative w-8 h-8 rounded-full border-2 border-white/20 hover:scale-105 transition-all group overflow-hidden">
              <input
                type="color"
                value={config.color}
                onChange={(e) => setConfig({ ...config, color: e.target.value })}
                className="absolute -inset-4 w-16 h-16 cursor-pointer opacity-0 z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-sky-500 flex items-center justify-center">
                <Plus className="w-4 h-4 text-white drop-shadow-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions / Physics */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physics Test</label>
          <div className="flex gap-2">
            <button
              onClick={() => onShoot('wristshot')}
              disabled={isAnimatingFlex}
              className="flex-1 py-2 bg-blue-600/80 hover:bg-blue-500 text-white text-[10px] font-bold rounded uppercase tracking-wider transition-all disabled:opacity-50"
            >
              Wristshot
            </button>
            <button
              onClick={() => onShoot('slapshot')}
              disabled={isAnimatingFlex}
              className="flex-1 py-2 bg-red-600/80 hover:bg-red-500 text-white text-[10px] font-bold rounded uppercase tracking-wider transition-all disabled:opacity-50"
            >
              Slapshot
            </button>
          </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Price</p>
            <p className="text-2xl font-black text-white">€{calculatePrice().toFixed(2)}</p>
          </div>
        </div>
        <button
          onClick={onSave}
          className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-black text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
