'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei'
import DominoTable from './DominoTable'
import { TableConfig } from '@/types/table'

interface CustomizerSceneProps {
  config: TableConfig
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#C9A84C" wireframe />
    </mesh>
  )
}

export default function CustomizerScene({ config }: CustomizerSceneProps) {
  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-800">
      <Canvas
        camera={{ position: [3.5, 2.8, 3.5], fov: 42 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[4, 6, 3]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-3, 3, -2]} intensity={0.4} />

        <Suspense fallback={<Loader />}>
          <Environment preset="apartment" />
          <group position={[0, 0.45, 0]}>
            <DominoTable config={config} />
          </group>
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.55}
            scale={6}
            blur={2.5}
            far={1}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={2.5}
          maxDistance={8}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate
          autoRotateSpeed={0.6}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
