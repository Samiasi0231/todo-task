'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useAppSelector } from '@/hooks/useTypedRedux'
import * as THREE from 'three'

interface ShapeData {
  pos:      [number, number, number]
  rot:      [number, number, number]
  scale:    number
  drift:    [number, number]
  rotSpeed: [number, number, number]
  type:     'box' | 'sphere' | 'torus' | 'octahedron'
  phase:    number
}

function FloatingShape({ data, pct }: { data: ShapeData; pct: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const t       = useRef(data.phase)

  const color = useMemo(() => {
    const c = new THREE.Color()
    if (pct < 50) {
      c.lerpColors(new THREE.Color('#f97316'), new THREE.Color('#6366f1'), pct / 50)
    } else {
      c.lerpColors(new THREE.Color('#6366f1'), new THREE.Color('#22c55e'), (pct - 50) / 50)
    }
    return c
  }, [pct])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    t.current += delta

    meshRef.current.position.x += data.drift[0] * delta
    meshRef.current.position.y += data.drift[1] * delta

    // Wrap around edges
    if (meshRef.current.position.x >  9) meshRef.current.position.x = -9
    if (meshRef.current.position.x < -9) meshRef.current.position.x =  9
    if (meshRef.current.position.y >  7) meshRef.current.position.y = -7
    if (meshRef.current.position.y < -7) meshRef.current.position.y =  7

    meshRef.current.rotation.x += data.rotSpeed[0] * delta
    meshRef.current.rotation.y += data.rotSpeed[1] * delta
    meshRef.current.rotation.z += data.rotSpeed[2] * delta

    const breathe = 1 + Math.sin(t.current * 0.7 + data.phase) * 0.05
    meshRef.current.scale.setScalar(data.scale * breathe)
    ;(meshRef.current.material as THREE.MeshBasicMaterial).color.copy(color)
  })

  const geo = useMemo(() => {
    switch (data.type) {
      case 'box':        return <boxGeometry args={[1, 1, 1]} />
      case 'sphere':     return <sphereGeometry args={[0.5, 8, 6]} />
      case 'torus':      return <torusGeometry args={[0.4, 0.15, 6, 12]} />
      case 'octahedron': return <octahedronGeometry args={[0.5]} />
    }
  }, [data.type])

  return (
    <mesh ref={meshRef} position={data.pos} rotation={data.rot} scale={data.scale}>
      {geo}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.10}
        wireframe={data.type !== 'sphere'}
      />
    </mesh>
  )
}

function SceneContent({ pct }: { pct: number }) {
  const shapes = useMemo<ShapeData[]>(() => {
    const types: ShapeData['type'][] = ['box', 'sphere', 'torus', 'octahedron']
    return Array.from({ length: 20 }, (_, i) => ({
      pos:      [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 4] as [number, number, number],
      rot:      [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2] as [number, number, number],
      scale:    0.25 + Math.random() * 0.65,
      drift:    [(Math.random() - 0.5) * 0.28, (Math.random() - 0.5) * 0.18] as [number, number],
      rotSpeed: [(Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.18] as [number, number, number],
      type:     types[i % 4],
      phase:    Math.random() * Math.PI * 2,
    }))
  }, [])

  return (
    <>
      <ambientLight intensity={0.4} />
      {shapes.map((s, i) => <FloatingShape key={i} data={s} pct={pct} />)}
    </>
  )
}

export default function Scene3D() {
  const tasks = useAppSelector(s => s.tasks.tasks)
  const done  = tasks.filter(t => t.status === 'done').length
  const pct   = tasks.length ? (done / tasks.length) * 100 : 0

  return (
    <div className="absolute inset-0 w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <SceneContent pct={pct} />
      </Canvas>
    </div>
  )
}