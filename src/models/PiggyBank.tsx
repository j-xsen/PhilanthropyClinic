import {useEffect, useMemo} from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import type {JSX} from "react/jsx-runtime";

type PiggyBankProps = JSX.IntrinsicElements['group'] & {
  curAnim: "Breathe" | "Jump";
}

export function PiggyBank({curAnim, ...props}: PiggyBankProps) {
  const { scene, animations } = useGLTF('/pig-transformed.glb')

  // Clone preserves skeleton + animation bindings
  const clone = useMemo(
      () => SkeletonUtils.clone(scene),
      [scene]
  )

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
