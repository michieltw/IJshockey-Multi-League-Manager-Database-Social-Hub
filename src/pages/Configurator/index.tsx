import { useState } from 'react';
import { Configurator3D } from './Configurator3D';
import { ConfiguratorUI } from './ConfiguratorUI';
import type { StickConfig } from './types';
import { INITIAL_CONFIG } from './types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Configurator() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<StickConfig>(INITIAL_CONFIG);
  const [shotTrigger, setShotTrigger] = useState<{ count: number; type: 'slapshot' | 'wristshot' }>({ count: 0, type: 'slapshot' });
  const [isAnimatingFlex, setIsAnimatingFlex] = useState(false);

  const handleShoot = (type: 'slapshot' | 'wristshot') => {
    setIsAnimatingFlex(true);
    setShotTrigger(prev => ({ count: prev.count + 1, type }));
  };

  const handleSave = () => {
    // In a real app, this would dispatch to a cart context or save to Firebase
    console.log("Saving stick configuration to DB/Cart:", JSON.stringify(config, null, 2));
    alert(`Configuration saved!\n\nCarbon: ${config.carbon}\nFlex: ${config.flex}\nCurve: ${config.curve}\n\nCheck console for JSON payload.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex overflow-hidden">

      {/* Back button overlay */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-slate-900/50 hover:bg-slate-800 text-white rounded-lg backdrop-blur-sm transition-all border border-white/10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Back to App</span>
      </button>

      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 text-slate-800/20 font-black text-[15vw] pointer-events-none uppercase tracking-tighter whitespace-nowrap z-0">
        BLACKOUT
      </div>

      {/* Info overlay left bottom */}
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <h2 className="text-4xl font-black text-white tracking-tight">Pro Custom</h2>
        <div className="flex items-center space-x-3 mt-2">
          <span className="px-2 py-1 bg-sky-500/20 border border-sky-500/50 text-sky-400 font-bold text-[10px] rounded uppercase tracking-widest">
            {config.handedness} Hand
          </span>
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
            {config.carbon} • {config.flex} Flex • {config.curve}
          </span>
        </div>
        <p className="mt-4 text-slate-500 text-[10px] uppercase tracking-widest max-w-xs leading-relaxed">
          Drag to rotate. Scroll to zoom. Use the right panel to customize materials and test physics.
        </p>
      </div>

      {/* 3D Viewport (Full Screen) */}
      <div className="flex-grow h-full relative z-0">
        <Configurator3D
          config={config}
          shotTrigger={shotTrigger}
          onFlexDone={() => setIsAnimatingFlex(false)}
          isAnimatingFlex={isAnimatingFlex}
        />
      </div>

      {/* UI Overlay Right Panel */}
      <ConfiguratorUI
        config={config}
        setConfig={setConfig}
        onShoot={handleShoot}
        isAnimatingFlex={isAnimatingFlex}
        onSave={handleSave}
      />
    </div>
  );
}
