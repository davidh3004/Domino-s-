'use client'

import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, SoftShadows } from '@react-three/drei'
import * as THREE from 'three'
import DominoTable from './DominoTable'
import { TableConfig } from '@/types/table'

function SceneBackground() {
  const { scene } = useThree()
  useEffect(() => {
    scene.background = new THREE.Color('#0a0806')
  }, [scene])
  return null
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#140c06" roughness={0.88} metalness={0.04} />
    </mesh>
  )
}

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
    <div className="w-full h-full" style={{ background: '#0a0806' }}>
      <Canvas
        camera={{ position: [3.5, 2.8, 3.5], fov: 42 }}
        shadows
        gl={{ antialias: true, toneMappingExposure: 1.4 }}
      >
        <SceneBackground />
        <SoftShadows size={32} samples={24} focus={0.5} />

        {/* Warm overhead spotlight */}
        <pointLight
          position={[0, 5, 0]}
          intensity={4.5}
          color="#ff8a40"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.001}
          distance={14}
        />
        <directionalLight position={[-3, 4, 3]} intensity={0.5} color="#fff0d8" />
        <directionalLight position={[1, 2, -5]} intensity={0.25} color="#ffdbb0" />
        <ambientLight intensity={0.10} />

        <Suspense fallback={<Loader />}>
          <Environment preset="lobby" />
          <Floor />
          <group position={[0, 0.46, 0]}>
            <DominoTable config={config} />
          </group>
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={2.5}
          maxDistance={8}
          minPolarAngle={Math.PI / 10}
          maxPolarAngle={Math.PI / 2.2}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
