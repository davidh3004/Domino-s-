'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'
import { TableConfig, WOOD_COLORS, FELT_COLORS, LEG_COLORS, EngravingStyle } from '@/types/table'

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

  ctx.fillStyle = hex
  ctx.fillRect(0, 0, size, size)

  const grad = ctx.createLinearGradient(0, 0, size * 0.8, 0)
  grad.addColorStop(0, `rgba(255,255,255,0.09)`)
  grad.addColorStop(0.45, `rgba(0,0,0,0.07)`)
  grad.addColorStop(1, `rgba(255,255,255,0.06)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

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

function createEngravingTexture(feltHex: string, style: EngravingStyle): THREE.CanvasTexture | null {
  if (style === 'none') return null
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // transparent base
  ctx.clearRect(0, 0, size, size)

  const r = parseInt(feltHex.slice(1, 3), 16)
  const g = parseInt(feltHex.slice(3, 5), 16)
  const b = parseInt(feltHex.slice(5, 7), 16)
  const lightLine = `rgba(${Math.min(r + 60, 255)},${Math.min(g + 60, 255)},${Math.min(b + 60, 255)},0.22)`
  const darkLine = `rgba(${Math.max(r - 30, 0)},${Math.max(g - 30, 0)},${Math.max(b - 30, 0)},0.18)`

  ctx.strokeStyle = lightLine
  ctx.lineWidth = 1.5

  if (style === 'classic') {
    // Diamond grid: 45° rotated lines
    const step = 64
    for (let i = -size; i < size * 2; i += step) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + size, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i - size, size)
      ctx.stroke()
    }
  } else if (style === 'modern') {
    // Border inset rectangle + corner L-brackets
    const pad = 60
    const bpad = 90
    ctx.strokeStyle = lightLine
    ctx.lineWidth = 3
    ctx.strokeRect(pad, pad, size - pad * 2, size - pad * 2)
    ctx.strokeStyle = darkLine
    ctx.lineWidth = 1.5
    ctx.strokeRect(bpad, bpad, size - bpad * 2, size - bpad * 2)
    // Corner L-shapes
    const arm = 70
    const corners = [
      [pad - 2, pad - 2, 1, 1],
      [size - pad + 2, pad - 2, -1, 1],
      [pad - 2, size - pad + 2, 1, -1],
      [size - pad + 2, size - pad + 2, -1, -1],
    ]
    ctx.strokeStyle = lightLine
    ctx.lineWidth = 4
    for (const [cx, cy, dx, dy] of corners) {
      ctx.beginPath()
      ctx.moveTo(cx + dx * arm, cy)
      ctx.lineTo(cx, cy)
      ctx.lineTo(cx, cy + dy * arm)
      ctx.stroke()
    }
  } else if (style === 'traditional') {
    // Decorative bezier corner motifs
    ctx.strokeStyle = lightLine
    ctx.lineWidth = 2
    const corners2 = [
      [0, 0, 1, 1],
      [size, 0, -1, 1],
      [0, size, 1, -1],
      [size, size, -1, -1],
    ]
    for (const [ox, oy, sx, sy] of corners2) {
      for (let arc = 0; arc < 4; arc++) {
        const r2 = 100 + arc * 55
        ctx.beginPath()
        ctx.moveTo(ox + sx * r2, oy)
        ctx.bezierCurveTo(
          ox + sx * r2 * 0.6, oy + sy * r2 * 0.2,
          ox + sx * r2 * 0.2, oy + sy * r2 * 0.6,
          ox, oy + sy * r2
        )
        ctx.stroke()
      }
    }
    // Center medallion
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, 80, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, 110, 0, Math.PI * 2)
    ctx.stroke()
  } else if (style === 'premium') {
    // Herringbone weave
    const step = 40
    const w = 14
    ctx.strokeStyle = lightLine
    ctx.lineWidth = w
    for (let row = -2; row < size / step + 2; row++) {
      for (let col = -2; col < size / step + 2; col++) {
        const x = col * step * 2
        const y = row * step * 2 + (col % 2 === 0 ? 0 : step)
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + step, y + step)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x + step, y)
        ctx.lineTo(x, y + step)
        ctx.stroke()
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
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
      {/* Dark recess */}
      <mesh>
        <cylinderGeometry args={[CUP_R, CUP_R, CUP_R * 0.6, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.95} />
      </mesh>
      {/* Wood outer rim */}
      <mesh>
        <cylinderGeometry args={[CUP_R + 0.018, CUP_R + 0.018, 0.016, 32]} />
        <WoodMaterial color={woodColor} tex={woodTex} roughness={0.38} clearcoat={0.95} />
      </mesh>
      {/* Chrome inner ring (torus) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <torusGeometry args={[CUP_R + 0.002, 0.008, 12, 48]} />
        <meshPhysicalMaterial color="#d0d0d0" metalness={0.95} roughness={0.05} reflectivity={1} />
      </mesh>
    </group>
  )
}

function TileSlots({ side, woodColor, woodTex }: {
  side: 'front' | 'back' | 'left' | 'right'
  woodColor: string
  woodTex: THREE.CanvasTexture | null
}) {
  const apronY = -(BORDER_H / 2 + APRON_H / 2)
  const slotW = 0.22
  const slotH = 0.10
  const slotD = 0.022
  const spacing = 0.32
  const inset = 0.006

  const isHorizontal = side === 'front' || side === 'back'
  const sign = side === 'front' || side === 'right' ? -1 : 1
  const apronFace = sign * (TABLE_SIZE / 2 - BORDER_W / 2 + BORDER_W / 2 - inset)

  return (
    <>
      {[-spacing / 2, spacing / 2].map((offset, i) => {
        const px = isHorizontal ? offset : apronFace
        const pz = isHorizontal ? apronFace : offset
        const rotY = isHorizontal ? 0 : Math.PI / 2
        return (
          <mesh key={i} position={[px, apronY, pz]} rotation={[0, rotY, 0]}>
            <boxGeometry args={[slotW, slotH, slotD]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
          </mesh>
        )
      })}
    </>
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

  const engravingTex = useMemo(() => {
    if (typeof window === 'undefined') return null
    return createEngravingTexture(feltColor, config.engravingStyle)
  }, [feltColor, config.engravingStyle])

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

      {/* Engraving overlay */}
      {engravingTex && (
        <mesh position={[0, SURFACE_DEPTH / 2 + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[innerSize * 0.95, innerSize * 0.95]} />
          <meshStandardMaterial map={engravingTex} transparent alphaTest={0.01} roughness={0.98} depthWrite={false} />
        </mesh>
      )}

      {/* Logo plane on felt */}
      {logoTex && (
        <mesh position={[0, SURFACE_DEPTH / 2 + 0.0008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[innerSize * 0.52, innerSize * 0.52]} />
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

      {/* Tile holder slots on all 4 sides */}
      <TileSlots side="front" woodColor={woodColor} woodTex={woodTex} />
      <TileSlots side="back" woodColor={woodColor} woodTex={woodTex} />
      <TileSlots side="left" woodColor={woodColor} woodTex={woodTex} />
      <TileSlots side="right" woodColor={woodColor} woodTex={woodTex} />

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
