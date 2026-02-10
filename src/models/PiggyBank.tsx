import {useEffect, useMemo} from 'react'
import {useGLTF, useAnimations, useKTX2} from '@react-three/drei'
import {SkeletonUtils} from 'three-stdlib'
import type {JSX} from "react/jsx-runtime"
import {Material, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, SRGBColorSpace} from "three"

type PiggyBankProps = JSX.IntrinsicElements['group'] & {
  curAnim: "Breathe" | "Jump"
}

export function PiggyBank({curAnim, ...props}: PiggyBankProps) {
  const { scene, animations } = useGLTF('/pig-transformed.glb')

  const clone = useMemo(
      () => SkeletonUtils.clone(scene),
      [scene]
  )

  const [pig, eye, pupil] = useKTX2([
    '/textures/pig/base.ktx2',
    '/textures/pig/eye.ktx2',
    '/textures/pig/pupil.ktx2'
  ])

  useEffect(() => {
    if (!pig && !eye && !pupil) return

    clone.traverse((o) => {
      const mesh = o as Mesh

      if (!mesh.isMesh || !mesh.material) return

      const mat = mesh.material

      if (!(mat instanceof Material) || mat.name === "pig") {
        if (pig) {
          pig.colorSpace = SRGBColorSpace
          pig.flipY = false
          pig.needsUpdate = true

          if (mat instanceof MeshPhysicalMaterial) {
            mat.metalness=0
            mat.roughness=1
            mat.map = pig
            mat.needsUpdate = true
          }
        }
      } else if (mat.name === "eye") {
        if (eye) {
          eye.colorSpace = SRGBColorSpace
          eye.flipY = false
          eye.needsUpdate = true

          if (mat instanceof MeshStandardMaterial) {
            mat.map = eye
            mat.roughness=0
            mat.metalness=0.3
            mat.needsUpdate = true
          }
        }
      } else if (mat.name === "pupil") {
        if (pupil) {
          pupil.colorSpace = SRGBColorSpace
          pupil.flipY = false
          pupil.needsUpdate = true

          if (mat instanceof MeshStandardMaterial) {
            mat.map = pupil
            mat.needsUpdate = true
          }
        }
      }
    })
  }, [clone, eye, pig, pupil])

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

useKTX2.preload("/textures/pig/base.ktx2")
useKTX2.preload("/textures/pig/eye.ktx2")
useKTX2.preload("/textures/pig/pupil.ktx2")
useGLTF.preload('/pig-transformed.glb')