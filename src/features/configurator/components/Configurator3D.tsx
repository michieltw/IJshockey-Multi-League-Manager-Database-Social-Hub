import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stage } from '@react-three/drei';
import StickModel from './StickModel';
import type { StickConfig } from '../../../types/index';

interface Configurator3DProps {
  config: StickConfig;
  shotTrigger: { count: number; type: 'slapshot' | 'wristshot' };
  onFlexDone: () => void;
  isAnimatingFlex: boolean;
}

export function Configurator3D({ config, shotTrigger, onFlexDone, isAnimatingFlex }: Configurator3DProps) {
  return (
    <Canvas shadows camera={{ position: [0, 1.2, 1.5], fov: 45 }} className="w-full h-full">
      <color attach="background" args={['#0f172a']} />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <spotLight position={[100, 100, 100]} angle={0.15} penumbra={1} intensity={1} />

        <Stage preset="soft" intensity={1} environment="city" adjustCamera={false} shadows={false}>
          <group rotation={[0, -Math.PI / 2, 0]}>
            <StickModel
              isInspecting={!isAnimatingFlex}
              shotTrigger={shotTrigger}
              onFlexDone={onFlexDone}
              config={config}
            />
          </group>
        </Stage>

        <OrbitControls makeDefault />
      </Suspense>
    </Canvas>
  );
}
