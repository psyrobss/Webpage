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
    MushroomKing_1: THREE.SkinnedMesh
    MushroomKing_2: THREE.SkinnedMesh
    MushroomKing_3: THREE.SkinnedMesh
    MushroomKing_4: THREE.SkinnedMesh
    MushroomKing_5: THREE.SkinnedMesh
    Mushroom_1: THREE.SkinnedMesh 
    Mushroom_2: THREE.SkinnedMesh
    Root: THREE.Bone
  }
  materials: { PaletteMaterial001: THREE.MeshStandardMaterial }
  animations: GLTFAction[]
}

type MushroomKingModelProps = React.ComponentPropsWithoutRef<'group'>;

export default function MushroomKingModel(props: MushroomKingModelProps) {
  const group = React.useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(`${prefix}/models/Mushroom King-transformed.glb`) as unknown as GLTFResult
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    const actionToPlay = names.find(name => name.includes('Idle') || name.includes('Walk')) || names[0];
    if (actionToPlay && actions[actionToPlay]) {
      actions[actionToPlay]?.reset().fadeIn(0.5).play();
      return () => { actions[actionToPlay]?.fadeOut(0.5); };
    }
  }, [actions, names]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <primitive object={nodes.Root} />
        <group name="MushroomKing" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <skinnedMesh castShadow receiveShadow name="MushroomKing_1" geometry={nodes.MushroomKing_1.geometry} material={materials.PaletteMaterial001} skeleton={nodes.MushroomKing_1.skeleton} />
          <skinnedMesh castShadow receiveShadow name="MushroomKing_2" geometry={nodes.MushroomKing_2.geometry} material={materials.PaletteMaterial001} skeleton={nodes.MushroomKing_2.skeleton} />
          <skinnedMesh castShadow receiveShadow name="MushroomKing_3" geometry={nodes.MushroomKing_3.geometry} material={materials.PaletteMaterial001} skeleton={nodes.MushroomKing_3.skeleton} />
          <skinnedMesh castShadow receiveShadow name="MushroomKing_4" geometry={nodes.MushroomKing_4.geometry} material={materials.PaletteMaterial001} skeleton={nodes.MushroomKing_4.skeleton} />
          <skinnedMesh castShadow receiveShadow name="MushroomKing_5" geometry={nodes.MushroomKing_5.geometry} material={materials.PaletteMaterial001} skeleton={nodes.MushroomKing_5.skeleton} />
        </group>
        <group name="Mushroom" position={[1.93, 1.76, -0.227]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <skinnedMesh castShadow receiveShadow name="Mushroom_1" geometry={nodes.Mushroom_1.geometry} material={materials.PaletteMaterial001} skeleton={nodes.Mushroom_1.skeleton} />
          <skinnedMesh castShadow receiveShadow name="Mushroom_2" geometry={nodes.Mushroom_2.geometry} material={materials.PaletteMaterial001} skeleton={nodes.Mushroom_2.skeleton} />
        </group>
      </group>
    </group>
  )
}
useGLTF.preload(`${prefix}/models/Mushroom King-transformed.glb`)