'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TableConfig, WOOD_COLORS, FELT_COLORS, LEG_COLORS } from '@/types/table'

interface DominoTableProps {
  config: TableConfig
}

const TABLE_SIZE = 2.4
const BORDER_W = 0.32
const BORDER_H = 0.08
const APRON_H = 0.18
const SURFACE_DEPTH = 0.015
const LEG_W = 0.06
const LEG_H = 0.72
const CUP_R = 0.09
const CUP_H = 0.05

function woodMaterial(color: string, roughness = 0.75) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={0.05}
    />
  )
}

function feltMaterial(color: string) {
  return <meshStandardMaterial color={color} roughness={0.92} metalness={0} />
}

function CupHolder({ x, z, woodColor }: { x: number; z: number; woodColor: string }) {
  return (
    <group position={[x, BORDER_H / 2 + 0.001, z]}>
      {/* dark inset ring */}
      <mesh>
        <cylinderGeometry args={[CUP_R, CUP_R, CUP_H + 0.002, 24]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      {/* wood rim */}
      <mesh>
        <cylinderGeometry args={[CUP_R + 0.01, CUP_R + 0.01, 0.012, 24]} />
        {woodMaterial(woodColor, 0.7)}
      </mesh>
    </group>
  )
}

function ScissorLegs({ color }: { color: string }) {
  const legMat = <meshStandardMaterial color={color} roughness={0.7} metalness={color === '#C0C0C0' ? 0.6 : 0.05} />
  const plankW = LEG_W
  const plankD = 0.045
  const halfH = LEG_H / 2
  const spread = TABLE_SIZE / 2 - 0.08

  return (
    <group position={[0, -(APRON_H / 2 + LEG_H / 2), 0]}>
      {/* Two X-crossed planks per side (front and back) */}
      {([-1, 1] as const).map((side) => {
        const zPos = side * (TABLE_SIZE / 2 - BORDER_W - 0.04)
        return (
          <group key={side} position={[0, 0, zPos]}>
            {/* Plank A: tilted left */}
            <mesh rotation={[0, 0, Math.atan2(halfH, spread)]}>
              <boxGeometry args={[Math.sqrt(spread * 2 * spread * 2 + LEG_H * LEG_H) + 0.02, plankD, plankW]} />
              {legMat}
            </mesh>
            {/* Plank B: tilted right */}
            <mesh rotation={[0, 0, -Math.atan2(halfH, spread)]}>
              <boxGeometry args={[Math.sqrt(spread * 2 * spread * 2 + LEG_H * LEG_H) + 0.02, plankD, plankW]} />
              {legMat}
            </mesh>
            {/* center pivot pin */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, plankW + 0.04, 12]} />
              {legMat}
            </mesh>
          </group>
        )
      })}
      {/* Bottom cross-stretcher */}
      <mesh position={[0, -halfH + 0.04, 0]}>
        <boxGeometry args={[TABLE_SIZE - BORDER_W * 2, 0.04, plankW]} />
        {legMat}
      </mesh>
    </group>
  )
}

function LEDStrip({ color }: { color: string }) {
  const inner = TABLE_SIZE / 2 - BORDER_W
  const y = -BORDER_H / 2 + 0.005
  const segments: [number, number, number, number, number][] = [
    [0, y, inner + SURFACE_DEPTH / 2, TABLE_SIZE - BORDER_W * 2, 0.012],
    [0, y, -(inner + SURFACE_DEPTH / 2), TABLE_SIZE - BORDER_W * 2, 0.012],
    [inner + SURFACE_DEPTH / 2, y, 0, 0.012, TABLE_SIZE - BORDER_W * 2],
    [-(inner + SURFACE_DEPTH / 2), y, 0, 0.012, TABLE_SIZE - BORDER_W * 2],
  ]

  return (
    <>
      {segments.map(([x, sy, z, w, d], i) => (
        <mesh key={i} position={[x, sy, z]}>
          <boxGeometry args={[w, 0.008, d]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.5}
            roughness={0.3}
          />
        </mesh>
      ))}
    </>
  )
}

export default function DominoTable({ config }: DominoTableProps) {
  const groupRef = useRef<THREE.Group>(null)

  const woodColor = WOOD_COLORS[config.wood]
  const feltColor = FELT_COLORS[config.felt]
  const legColor =
    config.legColor === 'match-wood' ? woodColor : LEG_COLORS[config.legColor]

  const innerSize = TABLE_SIZE - BORDER_W * 2
  const cupOffset = TABLE_SIZE / 2 - BORDER_W / 2

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* === PLAYING SURFACE === */}
      <mesh position={[0, -SURFACE_DEPTH / 2, 0]}>
        <boxGeometry args={[innerSize, SURFACE_DEPTH, innerSize]} />
        {config.accessories.decorativeSurface ? (
          <meshStandardMaterial color="#f5f5f0" roughness={0.6} />
        ) : (
          feltMaterial(feltColor)
        )}
      </mesh>

      {/* === FRAME TOP FACE (4 border planks) === */}
      {/* Front */}
      <mesh position={[0, 0, -(TABLE_SIZE / 2 - BORDER_W / 2)]}>
        <boxGeometry args={[TABLE_SIZE, BORDER_H, BORDER_W]} />
        {woodMaterial(woodColor)}
      </mesh>
      {/* Back */}
      <mesh position={[0, 0, TABLE_SIZE / 2 - BORDER_W / 2]}>
        <boxGeometry args={[TABLE_SIZE, BORDER_H, BORDER_W]} />
        {woodMaterial(woodColor)}
      </mesh>
      {/* Left */}
      <mesh position={[-(TABLE_SIZE / 2 - BORDER_W / 2), 0, 0]}>
        <boxGeometry args={[BORDER_W, BORDER_H, TABLE_SIZE - BORDER_W * 2]} />
        {woodMaterial(woodColor)}
      </mesh>
      {/* Right */}
      <mesh position={[TABLE_SIZE / 2 - BORDER_W / 2, 0, 0]}>
        <boxGeometry args={[BORDER_W, BORDER_H, TABLE_SIZE - BORDER_W * 2]} />
        {woodMaterial(woodColor)}
      </mesh>

      {/* === APRON (vertical sides below top face) === */}
      {/* Front */}
      <mesh position={[0, -(BORDER_H / 2 + APRON_H / 2), -(TABLE_SIZE / 2 - BORDER_W / 2)]}>
        <boxGeometry args={[TABLE_SIZE, APRON_H, BORDER_W]} />
        {woodMaterial(woodColor)}
      </mesh>
      {/* Back */}
      <mesh position={[0, -(BORDER_H / 2 + APRON_H / 2), TABLE_SIZE / 2 - BORDER_W / 2]}>
        <boxGeometry args={[TABLE_SIZE, APRON_H, BORDER_W]} />
        {woodMaterial(woodColor)}
      </mesh>
      {/* Left */}
      <mesh position={[-(TABLE_SIZE / 2 - BORDER_W / 2), -(BORDER_H / 2 + APRON_H / 2), 0]}>
        <boxGeometry args={[BORDER_W, APRON_H, TABLE_SIZE - BORDER_W * 2]} />
        {woodMaterial(woodColor)}
      </mesh>
      {/* Right */}
      <mesh position={[TABLE_SIZE / 2 - BORDER_W / 2, -(BORDER_H / 2 + APRON_H / 2), 0]}>
        <boxGeometry args={[BORDER_W, APRON_H, TABLE_SIZE - BORDER_W * 2]} />
        {woodMaterial(woodColor)}
      </mesh>

      {/* === CUP HOLDERS === */}
      {config.accessories.cupHolders && (
        <>
          <CupHolder x={-cupOffset} z={-cupOffset} woodColor={woodColor} />
          <CupHolder x={cupOffset} z={-cupOffset} woodColor={woodColor} />
          <CupHolder x={-cupOffset} z={cupOffset} woodColor={woodColor} />
          <CupHolder x={cupOffset} z={cupOffset} woodColor={woodColor} />
        </>
      )}

      {/* === LED STRIP === */}
      {config.accessories.leds && (
        <LEDStrip color={config.accessories.ledColor} />
      )}

      {/* === SCISSOR LEGS === */}
      <ScissorLegs color={legColor} />

      {/* === LED POINT LIGHT === */}
      {config.accessories.leds && (
        <pointLight
          position={[0, -0.05, 0]}
          color={config.accessories.ledColor}
          intensity={1.2}
          distance={2}
        />
      )}
    </group>
  )
}
