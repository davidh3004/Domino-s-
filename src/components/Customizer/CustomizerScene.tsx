'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, SoftShadows } from '@react-three/drei'
import DominoTable from './DominoTable'
import { TableConfig } from '@/types/table'

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#C9A84C" wireframe />
    </mesh>
  )
}

export default function CustomizerScene({ config }: { config: TableConfig }) {
  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-800">
      <Canvas
        camera={{ position: [3.5, 2.8, 3.5], fov: 42 }}
        shadows
        gl={{ antialias: true, toneMappingExposure: 1.15 }}
      >
        <SoftShadows size={28} samples={20} focus={0.5} />

        {/* Warm key light (top-right front) */}
        <directionalLight
          position={[4, 7, 3]}
          intensity={2.0}
          color="#fff8ee"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={22}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.0008}
        />
        {/* Cool fill light (left) */}
        <directionalLight position={[-4, 3, -1]} intensity={0.55} color="#d8e8ff" />
        {/* Subtle rim from behind */}
        <directionalLight position={[0, 2, -5]} intensity={0.28} color="#ffffff" />
        <ambientLight intensity={0.30} />

        <Suspense fallback={<Loader />}>
          <Environment preset="studio" />
          <group position={[0, 0.46, 0]}>
            <DominoTable config={config} />
          </group>
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.72}
            scale={7}
            blur={3.2}
            far={1.3}
            color="#140800"
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={2.5}
          maxDistance={8}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate
          autoRotateSpeed={0.5}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
