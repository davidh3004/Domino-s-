'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'
import { TableConfig, WOOD_COLORS, FELT_COLORS, LEG_COLORS } from '@/types/table'

const TABLE_SIZE = 2.4
const BORDER_W = 0.34
const BORDER_H = 0.09
const APRON_H = 0.20
const SURFACE_DEPTH = 0.018
const LEG_W = 0.065
const LEG_H = 0.74
const CUP_R = 0.092

function createWoodTexture(hex: string): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  ctx.fillStyle = hex
  ctx.fillRect(0, 0, size, size)

  // Subtle cross-grain gradient for depth
  const grad = ctx.createLinearGradient(0, 0, size * 0.8, 0)
  grad.addColorStop(0, `rgba(255,255,255,0.09)`)
  grad.addColorStop(0.45, `rgba(0,0,0,0.07)`)
  grad.addColorStop(1, `rgba(255,255,255,0.06)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  // Grain lines running along the Y axis
  for (let i = 0; i < 65; i++) {
    const x = (i / 65) * size + (Math.random() - 0.5) * (size / 65) * 1.8
    const lineWidth = 0.3 + Math.random() * 2.8
    const alpha = 0.03 + Math.random() * 0.11
    const dark = Math.random() > 0.38
    ctx.beginPath()
    ctx.strokeStyle = dark ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha * 0.55})`
    ctx.lineWidth = lineWidth
    let cx = x
    ctx.moveTo(cx, 0)
    for (let y = 0; y <= size; y += 5) {
      cx += (Math.random() - 0.5) * 1.6
      ctx.lineTo(cx, y)
    }
    ctx.stroke()
  }

  // Occasional knot rings (0 or 1)
  if (Math.random() > 0.45) {
    const kx = 0.2 * size + Math.random() * 0.6 * size
    const ky = 0.2 * size + Math.random() * 0.6 * size
    for (let ring = 0; ring < 7; ring++) {
      const rx = 6 + ring * 10
      ctx.beginPath()
      ctx.ellipse(kx, ky, rx, rx * 0.32, Math.PI / 5, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0,0,0,${0.07 - ring * 0.008})`
      ctx.lineWidth = 1.8 - ring * 0.18
      ctx.stroke()
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1, 2.2)
  return tex
}

interface WoodMatProps {
  color: string
  tex: THREE.CanvasTexture | null
  roughness?: number
  clearcoat?: number
}

function WoodMaterial({ color, tex, roughness = 0.42, clearcoat = 0.88 }: WoodMatProps) {
  return (
    <meshPhysicalMaterial
      color={color}
      map={tex}
      roughness={roughness}
      metalness={0}
      clearcoat={clearcoat}
      clearcoatRoughness={0.16}
      reflectivity={0.5}
    />
  )
}

function CupHolder({
  x, z, woodColor, woodTex,
}: { x: number; z: number; woodColor: string; woodTex: THREE.CanvasTexture | null }) {
  return (
    <group position={[x, BORDER_H / 2 + 0.001, z]}>
      <mesh>
        <cylinderGeometry args={[CUP_R, CUP_R, CUP_R * 0.6, 32]} />
        <meshStandardMaterial color="#080808" roughness={0.9} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[CUP_R + 0.014, CUP_R + 0.014, 0.015, 32]} />
        <WoodMaterial color={woodColor} tex={woodTex} roughness={0.38} clearcoat={0.95} />
      </mesh>
    </group>
  )
}

function ScissorLegs({ color, isChrome }: { color: string; isChrome: boolean }) {
  const halfH = LEG_H / 2
  const spread = TABLE_SIZE / 2 - 0.1
  const len = Math.sqrt((spread * 2) ** 2 + LEG_H ** 2) + 0.02
  const angle = Math.atan2(halfH, spread)

  const mat = isChrome ? (
    <meshPhysicalMaterial color={color} roughness={0.08} metalness={0.92} reflectivity={1} />
  ) : (
    <meshPhysicalMaterial color={color} roughness={0.38} metalness={0} clearcoat={0.7} clearcoatRoughness={0.2} />
  )

  return (
    <group position={[0, -(APRON_H / 2 + LEG_H / 2), 0]}>
      {([-1, 1] as const).map((side) => {
        const zPos = side * (TABLE_SIZE / 2 - BORDER_W - 0.05)
        return (
          <group key={side} position={[0, 0, zPos]}>
            <mesh rotation={[0, 0, angle]}>
              <boxGeometry args={[len, 0.042, LEG_W]} />
              {mat}
            </mesh>
            <mesh rotation={[0, 0, -angle]}>
              <boxGeometry args={[len, 0.042, LEG_W]} />
              {mat}
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, LEG_W + 0.04, 20]} />
              {mat}
            </mesh>
          </group>
        )
      })}
      <mesh position={[0, -halfH + 0.045, 0]}>
        <boxGeometry args={[TABLE_SIZE - BORDER_W * 2, 0.042, LEG_W]} />
        {mat}
      </mesh>
    </group>
  )
}

function LEDStrip({ color }: { color: string }) {
  const inner = TABLE_SIZE / 2 - BORDER_W
  const y = -BORDER_H / 2 + 0.004
  const len = TABLE_SIZE - BORDER_W * 2

  return (
    <>
      {([
        [0, y, inner + 0.007, len, 0.009],
        [0, y, -(inner + 0.007), len, 0.009],
        [inner + 0.007, y, 0, 0.009, len],
        [-(inner + 0.007), y, 0, 0.009, len],
      ] as [number, number, number, number, number][]).map(([x, sy, z, w, d], i) => (
        <mesh key={i} position={[x, sy, z]}>
          <boxGeometry args={[w, 0.006, d]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.5} roughness={0.2} />
        </mesh>
      ))}
    </>
  )
}

export default function DominoTable({ config }: { config: TableConfig }) {
  const woodColor = WOOD_COLORS[config.wood]
  const feltColor = FELT_COLORS[config.felt]
  const legColor = config.legColor === 'match-wood' ? woodColor : LEG_COLORS[config.legColor]
  const isChrome = config.legColor === 'chrome'

  const woodTex = useMemo(() => {
    if (typeof window === 'undefined') return null
    return createWoodTexture(woodColor)
  }, [woodColor])

  const logoTexRef = useRef<THREE.Texture | null>(null)
  const [logoTex, setLogoTex] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!config.logoUrl) {
      setLogoTex(null)
      return
    }
    const loader = new THREE.TextureLoader()
    loader.load(config.logoUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      if (logoTexRef.current) logoTexRef.current.dispose()
      logoTexRef.current = tex
      setLogoTex(tex)
    })
  }, [config.logoUrl])

  const innerSize = TABLE_SIZE - BORDER_W * 2
  const cupOffset = TABLE_SIZE / 2 - BORDER_W / 2

  const frameParts = [
    { pos: [0, 0, -(TABLE_SIZE / 2 - BORDER_W / 2)], size: [TABLE_SIZE, BORDER_H, BORDER_W] },
    { pos: [0, 0, TABLE_SIZE / 2 - BORDER_W / 2], size: [TABLE_SIZE, BORDER_H, BORDER_W] },
    { pos: [-(TABLE_SIZE / 2 - BORDER_W / 2), 0, 0], size: [BORDER_W, BORDER_H, innerSize] },
    { pos: [TABLE_SIZE / 2 - BORDER_W / 2, 0, 0], size: [BORDER_W, BORDER_H, innerSize] },
  ] as const

  const apronParts = [
    { pos: [0, -(BORDER_H / 2 + APRON_H / 2), -(TABLE_SIZE / 2 - BORDER_W / 2)], size: [TABLE_SIZE, APRON_H, BORDER_W] },
    { pos: [0, -(BORDER_H / 2 + APRON_H / 2), TABLE_SIZE / 2 - BORDER_W / 2], size: [TABLE_SIZE, APRON_H, BORDER_W] },
    { pos: [-(TABLE_SIZE / 2 - BORDER_W / 2), -(BORDER_H / 2 + APRON_H / 2), 0], size: [BORDER_W, APRON_H, innerSize] },
    { pos: [TABLE_SIZE / 2 - BORDER_W / 2, -(BORDER_H / 2 + APRON_H / 2), 0], size: [BORDER_W, APRON_H, innerSize] },
  ] as const

  return (
    <group>
      {/* Felt surface */}
      <mesh position={[0, -SURFACE_DEPTH / 2, 0]}>
        <boxGeometry args={[innerSize, SURFACE_DEPTH, innerSize]} />
        <meshStandardMaterial color={feltColor} roughness={0.96} metalness={0} />
      </mesh>

      {/* Logo plane on felt */}
      {logoTex && (
        <mesh position={[0, SURFACE_DEPTH / 2 + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[innerSize * 0.62, innerSize * 0.62]} />
          <meshStandardMaterial map={logoTex} transparent alphaTest={0.05} roughness={0.9} depthWrite={false} />
        </mesh>
      )}

      {/* Frame top */}
      {frameParts.map(({ pos, size }, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={size as [number, number, number]} />
          <WoodMaterial color={woodColor} tex={woodTex} />
        </mesh>
      ))}

      {/* Apron sides */}
      {apronParts.map(({ pos, size }, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={size as [number, number, number]} />
          <WoodMaterial color={woodColor} tex={woodTex} roughness={0.5} clearcoat={0.6} />
        </mesh>
      ))}

      {/* Cup holders */}
      {config.accessories.cupHolders && (
        <>
          <CupHolder x={-cupOffset} z={-cupOffset} woodColor={woodColor} woodTex={woodTex} />
          <CupHolder x={cupOffset} z={-cupOffset} woodColor={woodColor} woodTex={woodTex} />
          <CupHolder x={-cupOffset} z={cupOffset} woodColor={woodColor} woodTex={woodTex} />
          <CupHolder x={cupOffset} z={cupOffset} woodColor={woodColor} woodTex={woodTex} />
        </>
      )}

      {/* LED strip */}
      {config.accessories.leds && <LEDStrip color={config.accessories.ledColor} />}

      {/* Scissor legs */}
      <ScissorLegs color={legColor} isChrome={isChrome} />

      {/* LED glow light */}
      {config.accessories.leds && (
        <pointLight position={[0, -0.06, 0]} color={config.accessories.ledColor} intensity={1.8} distance={2.8} />
      )}
    </group>
  )
}
