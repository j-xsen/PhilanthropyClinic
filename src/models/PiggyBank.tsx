import {useEffect, useMemo} from 'react'
import {useGLTF, useAnimations, useKTX2} from '@react-three/drei'
import {SkeletonUtils} from 'three-stdlib'
import type {JSX} from "react/jsx-runtime"
import {Mesh, MeshStandardMaterial} from "three"

type PiggyBankProps = JSX.IntrinsicElements['group'] & {
  curAnim: "Breathe" | "Jump"
}

export function PiggyBank({curAnim, ...props}: PiggyBankProps) {
  const { scene, animations } = useGLTF('/pig-transformed.glb')

  const clone = useMemo(
      () => SkeletonUtils.clone(scene),
      [scene]
  )

  const [pig] = useKTX2([
    '/textures/pig.ktx2',
  ])

  useEffect(() => {
    if (!pig) return

    clone.traverse((o) => {
      const mesh = o as Mesh

      if (!mesh.isMesh || !mesh.material) return

      const mat = mesh.material

      if (mat instanceof MeshStandardMaterial) {
          mat.map=pig
        mat.roughness=1
        mat.metalness=0.3
      }
    })
  }, [clone, pig])

  const { actions } = useAnimations(animations, clone)

  useEffect(() => {
    const action = actions[curAnim]
    if (!action) return

    action.reset().fadeIn(0.2).play()

    return () => {
      action.fadeOut(0.2)
    }
  }, [actions, curAnim])

  return <primitive object={clone} {...props} />
}

useGLTF.preload('/pig-transformed.glb')