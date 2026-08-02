import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { TessellateModifier, mergeVertices } from 'three-stdlib';
import * as THREE from 'three';
import type { StickConfig } from '../../../types/index';

export interface StickModelProps {
  isInspecting: boolean;
  shotTrigger: { count: number, type: 'slapshot' | 'wristshot' };
  onFlexDone: () => void;
  config: StickConfig;
}

export function StickModel({ isInspecting, shotTrigger, onFlexDone, config, ...props }: StickModelProps) {
  // Use public glTF model
  const { nodes, materials } = useGLTF('/gltf/HockeyStickBake.gltf') as any;
  const meshRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    let geom = nodes.lowpolyhockeystick.geometry.clone();

    // Convert to non-indexed for TessellateModifier
    geom = geom.toNonIndexed();

    // Subdivide the mesh so it has enough vertices to bend smoothly
    const tessellateModifier = new TessellateModifier(0.05, 6);
    geom = tessellateModifier.modify(geom);

    // Merge vertices to allow smooth shading across the tessellated faces
    geom = mergeVertices(geom);
    geom.computeVertexNormals();

    // Save the original positions for the bend calculation
    geom.userData.originalPosition = geom.attributes.position.clone();
    return geom;
  }, [nodes]);

  // Animation state
  const animState = useRef({
    phase: 'IDLE', // IDLE, WINDUP, DOWNSWING, FLEX, SNAP, FOLLOWTHROUGH, WRIST_WINDUP, etc.
    time: 0,
    flexMain: 0,
    flexVib: 0,
    baseRotX: 0,
    baseRotY: 0,
    baseRotZ: 0,
  });

  useEffect(() => {
    if (shotTrigger.count > 0) {
      if (shotTrigger.type === 'slapshot') {
        animState.current.phase = 'WINDUP';
      } else {
        animState.current.phase = 'WRIST_WINDUP';
      }
      animState.current.time = 0;
    }
  }, [shotTrigger]);

  useFrame((_state, delta) => {
    const anim = animState.current;

    let targetRotZ = meshRef.current?.rotation.z || 0;
    let targetRotX = meshRef.current?.rotation.x || 0;
    let targetPosY = meshRef.current?.position.y || 0;

    if (anim.phase !== 'IDLE') {
      anim.time += delta;

      if (anim.phase === 'WINDUP') {
        const progress = Math.min(anim.time / 0.4, 1);
        targetRotZ = THREE.MathUtils.lerp(0, -Math.PI / 3, progress);
        targetRotX = THREE.MathUtils.lerp(0, Math.PI / 4, progress);
        targetPosY = THREE.MathUtils.lerp(0, 0.5, progress);
        if (progress >= 1) { anim.phase = 'DOWNSWING'; anim.time = 0; }
      } else if (anim.phase === 'DOWNSWING') {
        const progress = Math.min(anim.time / 0.1, 1);
        targetRotZ = THREE.MathUtils.lerp(-Math.PI / 3, Math.PI / 8, progress);
        targetRotX = THREE.MathUtils.lerp(Math.PI / 4, 0, progress);
        targetPosY = THREE.MathUtils.lerp(0.5, -0.3, progress);
        if (progress >= 1) { anim.phase = 'FLEX'; anim.time = 0; }
      } else if (anim.phase === 'FLEX') {
        const progress = Math.min(anim.time / 3.5, 1); // 3.5s slow mo flex

        const flexMultiplier = 85 / config.flex;
        const flexMagnitude = progress * 0.50 * flexMultiplier;

        anim.flexMain = -flexMagnitude * 0.2; // Top bends a little
        anim.flexVib = -flexMagnitude * 0.8; // Bottom bends more

        targetRotZ = Math.PI / 8 + flexMagnitude * 0.5;
        targetPosY = -0.3 - flexMagnitude * 0.5;
        targetRotX = 0;

        if (progress >= 1) { anim.phase = 'SNAP'; anim.time = 0; }
      } else if (anim.phase === 'SNAP') {
        const progress = Math.min(anim.time / 0.4, 1);
        const flexMultiplier = 85 / config.flex;

        targetRotZ = THREE.MathUtils.lerp(Math.PI / 8 + 0.25 * flexMultiplier, Math.PI / 4, progress);
        targetPosY = THREE.MathUtils.lerp(-0.55 * flexMultiplier, 0.2, progress);
        targetRotX = 0;

        anim.flexMain = THREE.MathUtils.lerp(-0.1 * flexMultiplier, 0.05 * flexMultiplier, progress);
        anim.flexVib = THREE.MathUtils.lerp(-0.4 * flexMultiplier, 0.25 * flexMultiplier, progress);

        if (progress >= 1) { anim.phase = 'FOLLOWTHROUGH'; anim.time = 0; }
      } else if (anim.phase === 'FOLLOWTHROUGH') {
        const progress = Math.min(anim.time / 4.0, 1); // Longer follow-through
        targetRotZ = THREE.MathUtils.lerp(Math.PI / 4, 0, progress);
        targetPosY = THREE.MathUtils.lerp(0.2, 0, progress);
        targetRotX = 0;

        const flexMultiplier = 85 / config.flex;
        const dampingTop = Math.exp(-anim.time * 2); // Top damps fast
        const dampingBot = Math.exp(-anim.time * 0.8); // Bottom rings longer

        anim.flexMain = 0.05 * flexMultiplier * Math.cos(anim.time * 5) * dampingTop;
        anim.flexVib = 0.25 * flexMultiplier * Math.cos(anim.time * 5) * dampingBot;

        if (progress >= 1) {
          anim.phase = 'IDLE';
          if (onFlexDone) onFlexDone();
        }
      } else if (anim.phase === 'WRIST_WINDUP') {
        const progress = Math.min(anim.time / 0.8, 1);
        targetRotZ = THREE.MathUtils.lerp(0, -Math.PI / 6, progress);
        targetRotX = THREE.MathUtils.lerp(0, Math.PI / 8, progress);
        targetPosY = THREE.MathUtils.lerp(0, 0.2, progress);
        if (progress >= 1) { anim.phase = 'WRIST_FLEX'; anim.time = 0; }
      } else if (anim.phase === 'WRIST_FLEX') {
        const progress = Math.min(anim.time / 2.5, 1);
        const flexMultiplier = 85 / config.flex;
        const flexMagnitude = progress * 0.35 * flexMultiplier; // less flex for wristshot

        anim.flexMain = -flexMagnitude * 0.3;
        anim.flexVib = -flexMagnitude * 0.7;

        targetRotZ = -Math.PI / 6 + flexMagnitude * 0.8;
        targetPosY = 0.2 - flexMagnitude * 0.8;
        targetRotX = Math.PI / 8 - flexMagnitude * 0.2;

        if (progress >= 1) { anim.phase = 'WRIST_SNAP'; anim.time = 0; }
      } else if (anim.phase === 'WRIST_SNAP') {
        const progress = Math.min(anim.time / 0.3, 1);
        const flexMultiplier = 85 / config.flex;

        targetRotZ = THREE.MathUtils.lerp(-Math.PI / 6 + 0.28 * flexMultiplier, Math.PI / 6, progress);
        targetPosY = THREE.MathUtils.lerp(0.2 - 0.28 * flexMultiplier, 0.1, progress);
        targetRotX = THREE.MathUtils.lerp(Math.PI / 8 - 0.07 * flexMultiplier, 0, progress);

        anim.flexMain = THREE.MathUtils.lerp(-0.105 * flexMultiplier, 0.02 * flexMultiplier, progress);
        anim.flexVib = THREE.MathUtils.lerp(-0.245 * flexMultiplier, 0.15 * flexMultiplier, progress);

        if (progress >= 1) { anim.phase = 'WRIST_FOLLOWTHROUGH'; anim.time = 0; }
      } else if (anim.phase === 'WRIST_FOLLOWTHROUGH') {
        const progress = Math.min(anim.time / 3.0, 1);
        targetRotZ = THREE.MathUtils.lerp(Math.PI / 6, 0, progress);
        targetPosY = THREE.MathUtils.lerp(0.1, 0, progress);
        targetRotX = 0;

        const flexMultiplier = 85 / config.flex;
        const dampingTop = Math.exp(-anim.time * 2);
        const dampingBot = Math.exp(-anim.time * 1);

        anim.flexMain = 0.02 * flexMultiplier * Math.cos(anim.time * 5) * dampingTop;
        anim.flexVib = 0.15 * flexMultiplier * Math.cos(anim.time * 5) * dampingBot;

        if (progress >= 1) {
          anim.phase = 'IDLE';
          if (onFlexDone) onFlexDone();
        }
      }

    } else if (isInspecting && meshRef.current) {
      targetRotZ = 0;
      targetRotX = 0;
      targetPosY = 0;
    }

    if (meshRef.current) {
      meshRef.current.rotation.z = targetRotZ;
      meshRef.current.rotation.x = targetRotX;
      meshRef.current.position.y = targetPosY;
    }

    const positions = geometry.attributes.position.array as Float32Array;
    const original = geometry.userData.originalPosition.array as Float32Array;

      const Z_top = 0.79;
      let Z_mid = 0.2; // Mid kick
      if (config.kickPoint === 'Low') Z_mid = -0.2;
      if (config.kickPoint === 'High') Z_mid = 0.5;
      const Z_blade = -0.65;

      const L_full = Z_top - Z_blade;
      const L_bot = Z_mid - Z_blade;

      const A_main = anim.flexMain;
      const A_vib = anim.flexVib;

      const slope = -2 * A_main / L_full - 2 * A_vib / L_bot;
      const theta = Math.atan(slope);
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      let curveTwist = 0;
      let curveBend = 0;
      let curveStart = 0;
      if (config.curve === 'P92') { curveTwist = 0.25; curveBend = 0.045; curveStart = 0.4; }
      if (config.curve === 'P28') { curveTwist = 0.40; curveBend = 0.065; curveStart = 0.6; }
      if (config.curve === 'P88') { curveTwist = 0.05; curveBend = 0.050; curveStart = 0.2; }
      if (config.curve === 'PM9') { curveTwist = 0.02; curveBend = 0.020; curveStart = 0.1; }
      if (config.curve === 'P02') { curveTwist = 0.35; curveBend = 0.040; curveStart = 0.5; }
      if (config.curve === 'P08') { curveTwist = 0.50; curveBend = 0.075; curveStart = 0.7; }
      if (config.curve === 'P91A') { curveTwist = 0.30; curveBend = 0.035; curveStart = 0.3; }
      if (config.curve === 'P14') { curveTwist = 0.20; curveBend = 0.055; curveStart = 0.75; }

      for (let i = 0; i < positions.length; i += 3) {
        const origX = original[i];
        const origY = original[i+1];
        const origZ = original[i+2];

        if (origZ >= Z_blade) {
          const t_main = (Z_top - origZ) / L_full;
          let dy = A_main * (t_main * t_main);

          if (origZ < Z_mid) {
            const t_bot = (Z_mid - origZ) / L_bot;
            dy += A_vib * (t_bot * t_bot);
          }

          positions[i] = origX;
          positions[i+1] = origY + dy;
          positions[i+2] = origZ;
        } else {
          const dy_blade = A_main + A_vib;

          let cX = origX;
          let cY = origY;
          if (origZ < Z_blade) {
             const bladeLength = 0.22;
             const t_along = Math.min(Math.max((Z_blade - origZ) / bladeLength, 0), 1);
             const t_curve = Math.max(0, (t_along - curveStart) / (1 - curveStart));

             const tw = curveTwist * t_curve;
             const cCos = Math.cos(tw);
             const cSin = Math.sin(tw);
             cX = origX * cCos - origY * cSin;
             cY = origX * cSin + origY * cCos;

             // The physical hook (bend) of the blade
             const bendExponent = config.curve === 'P28' ? 3 : 2;
             cY -= curveBend * Math.pow(t_curve, bendExponent);
          }

          const dz = origZ - Z_blade;
          const newDz = dz * cosT - cY * sinT;
          const newY = dz * sinT + cY * cosT;

          positions[i] = cX;
          positions[i+1] = newY + dy_blade;
          positions[i+2] = Z_blade + newDz;
        }
      }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group {...props} dispose={null}>
      <group scale={[config.handedness === 'Left' ? 1 : -1, 1, 1]}>
        <group ref={meshRef}>
          <mesh geometry={geometry}>
            <meshStandardMaterial
              map={materials['lowpolyhockeystick_mat.001'].map}
              color={config.color}
              roughness={0.8}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Preload the model
useGLTF.preload('/gltf/HockeyStickBake.gltf');
export default StickModel;