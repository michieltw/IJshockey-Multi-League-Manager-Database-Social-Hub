import React from 'react';
import { useGesture } from '@use-gesture/react';
import { motion, useSpring } from 'framer-motion';

type IceRinkProps = {
  onIceClick: (x: number, y: number) => void;
  isMirrored?: boolean;
};

export default function IceRink({ onIceClick, isMirrored = false }: IceRinkProps) {
  // Using springs for smooth transform resets/adjustments
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });
  const rinkRef = React.useRef<HTMLDivElement>(null);

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        x.set(dx);
        y.set(dy);
      },
      onPinch: ({ offset: [d] }) => {
        scale.set(d);
      }
    },
    {
      target: rinkRef,
      eventOptions: { passive: false },
      drag: { from: () => [x.get(), y.get()] },
      pinch: { from: () => [scale.get(), 0], scaleBounds: { min: 0.5, max: 3 } }
    }
  );

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!rinkRef.current) return;
    const rect = rinkRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Normalize coordinates based on current actual viewable SVG dimensions
    let normX = rawX / rect.width;
    let normY = rawY / rect.height;

    if (isMirrored) {
      normX = 1 - normX;
      normY = 1 - normY;
    }

    onIceClick(normX, normY);
  };

  // Dimensions
  const w = 1000;
  const h = 425; // standard ~85x200ft ratio approx

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center bg-zinc-900 select-none touch-none">
      <motion.div
        ref={rinkRef}
        className="w-full max-w-[1200px] aspect-[1000/425] bg-white rounded-[100px] overflow-hidden relative shadow-lg"
        style={{ x, y, scale }}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-full"
          onClick={handleClick}
          style={{ transform: isMirrored ? 'rotate(180deg)' : 'none' }}
        >
          {/* Ice surface base */}
          <rect width={w} height={h} rx="100" fill="#EBF5FB" />

          {/* Boards */}
          <rect width={w} height={h} rx="100" fill="none" stroke="#2C3E50" strokeWidth="10" />

          {/* Red Line (Center) */}
          <line x1={w/2} y1="0" x2={w/2} y2={h} stroke="#E74C3C" strokeWidth="8" />
          {/* Center Circle */}
          <circle cx={w/2} cy={h/2} r="65" fill="none" stroke="#3498DB" strokeWidth="6" />
          {/* Center Faceoff Spot */}
          <circle cx={w/2} cy={h/2} r="5" fill="#3498DB" />

          {/* Blue Lines */}
          <line x1={w/2 - 145} y1="0" x2={w/2 - 145} y2={h} stroke="#3498DB" strokeWidth="8" />
          <line x1={w/2 + 145} y1="0" x2={w/2 + 145} y2={h} stroke="#3498DB" strokeWidth="8" />

          {/* Goal Lines */}
          <line x1="55" y1="20" x2="55" y2={h-20} stroke="#E74C3C" strokeWidth="5" />
          <line x1={w-55} y1="20" x2={w-55} y2={h-20} stroke="#E74C3C" strokeWidth="5" />

          {/* Goal Creases */}
          <path d={`M 55 ${h/2 - 30} A 30 30 0 0 1 55 ${h/2 + 30} Z`} fill="#AED6F1" stroke="#E74C3C" strokeWidth="3" />
          <path d={`M ${w-55} ${h/2 - 30} A 30 30 0 0 0 ${w-55} ${h/2 + 30} Z`} fill="#AED6F1" stroke="#E74C3C" strokeWidth="3" />

          {/* Goals */}
          <rect x="40" y={h/2 - 15} width="15" height="30" fill="none" stroke="#E74C3C" strokeWidth="4" rx="2"/>
          <rect x={w-55} y={h/2 - 15} width="15" height="30" fill="none" stroke="#E74C3C" strokeWidth="4" rx="2"/>

          {/* Faceoff Circles & Spots (Left Zone) */}
          <circle cx="165" cy={h/2 - 110} r="65" fill="none" stroke="#E74C3C" strokeWidth="5" />
          <circle cx="165" cy={h/2 - 110} r="5" fill="#E74C3C" />
          <circle cx="165" cy={h/2 + 110} r="65" fill="none" stroke="#E74C3C" strokeWidth="5" />
          <circle cx="165" cy={h/2 + 110} r="5" fill="#E74C3C" />

          {/* Faceoff Circles & Spots (Right Zone) */}
          <circle cx={w-165} cy={h/2 - 110} r="65" fill="none" stroke="#E74C3C" strokeWidth="5" />
          <circle cx={w-165} cy={h/2 - 110} r="5" fill="#E74C3C" />
          <circle cx={w-165} cy={h/2 + 110} r="65" fill="none" stroke="#E74C3C" strokeWidth="5" />
          <circle cx={w-165} cy={h/2 + 110} r="5" fill="#E74C3C" />

          {/* Neutral Zone Faceoff Spots */}
          <circle cx={w/2 - 110} cy={h/2 - 110} r="5" fill="#E74C3C" />
          <circle cx={w/2 - 110} cy={h/2 + 110} r="5" fill="#E74C3C" />
          <circle cx={w/2 + 110} cy={h/2 - 110} r="5" fill="#E74C3C" />
          <circle cx={w/2 + 110} cy={h/2 + 110} r="5" fill="#E74C3C" />

        </svg>
      </motion.div>
    </div>
  );
}