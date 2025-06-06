/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import * as THREE from 'three'
import React, { useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF, SkeletonUtils } from 'three-stdlib'

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

type ActionName = 'CharacterArmature|Death' | 'CharacterArmature|Duck' | 'CharacterArmature|HitReact' | 'CharacterArmature|Idle' | 'CharacterArmature|Jump' | 'CharacterArmature|Jump_Idle' | 'CharacterArmature|Jump_Land' | 'CharacterArmature|No' | 'CharacterArmature|Punch' | 'CharacterArmature|Run' | 'CharacterArmature|Walk' | 'CharacterArmature|Wave' | 'CharacterArmature|Weapon' | 'CharacterArmature|Yes'
interface GLTFAction extends THREE.AnimationClip { name: ActionName }

type GLTFResult = GLTF & {
  nodes: {
    Frog_1: THREE.SkinnedMesh
    Frog_2: THREE.SkinnedMesh
    Frog_3: THREE.SkinnedMesh
    Frog_4: THREE.SkinnedMesh
    Root: THREE.Bone
  }
  materials: {
    Frog_Secondary: THREE.MeshStandardMaterial
    Frog_Main: THREE.MeshStandardMaterial
    Eye_Black: THREE.MeshStandardMaterial
    Eye_White: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

type FrogModelProps = React.ComponentPropsWithoutRef<'group'>;

export default function FrogModel(props: FrogModelProps) {
  const group = React.useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(`${prefix}/models/Frog-transformed.glb`) as unknown as GLTFResult
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    const actionToPlay = names.find(name => name.includes('Idle') || name.includes('Jump_Idle')) || names[0];
    if (actionToPlay && actions[actionToPlay]) {
      actions[actionToPlay]?.reset().fadeIn(0.5).play();
      return () => { actions[actionToPlay]?.fadeOut(0.5); };
    }
  }, [actions, names]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <primitive object={nodes.Root} />
        <group name="Frog" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <skinnedMesh castShadow receiveShadow name="Frog_1" geometry={nodes.Frog_1.geometry} material={materials.Frog_Secondary} skeleton={nodes.Frog_1.skeleton} />
          <skinnedMesh castShadow receiveShadow name="Frog_2" geometry={nodes.Frog_2.geometry} material={materials.Frog_Main} skeleton={nodes.Frog_2.skeleton} />
          <skinnedMesh castShadow receiveShadow name="Frog_3" geometry={nodes.Frog_3.geometry} material={materials.Eye_Black} skeleton={nodes.Frog_3.skeleton} />
          <skinnedMesh castShadow receiveShadow name="Frog_4" geometry={nodes.Frog_4.geometry} material={materials.Eye_White} skeleton={nodes.Frog_4.skeleton} />
        </group>
      </group>
    </group>
  )
}
useGLTF.preload(`${prefix}/models/Frog-transformed.glb`)