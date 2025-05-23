/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import * as THREE from 'three'
import React, { useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF, SkeletonUtils } from 'three-stdlib'

const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';

type ActionName = 'CharacterArmature|Bite_Front' | 'CharacterArmature|Dance' | 'CharacterArmature|Death' | 'CharacterArmature|HitRecieve' | 'CharacterArmature|Idle' | 'CharacterArmature|Jump' | 'CharacterArmature|No' | 'CharacterArmature|Walk' | 'CharacterArmature|Yes'
interface GLTFAction extends THREE.AnimationClip { name: ActionName }

type GLTFResult = GLTF & {
  nodes: {
    Birb_Blob_1: THREE.SkinnedMesh
    Birb_Blob_2: THREE.SkinnedMesh
    Birb_Blob_3: THREE.SkinnedMesh
    Birb_Blob_4: THREE.SkinnedMesh
    Birb_Blob_5: THREE.SkinnedMesh
    Body: THREE.Bone
    Head: THREE.Bone
  }
  materials: { PaletteMaterial001: THREE.MeshStandardMaterial }
  animations: GLTFAction[]
}

type BirbModelProps = React.ComponentPropsWithoutRef<'group'>;

export default function BirbModel(props: BirbModelProps) {
  const group = React.useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(`${prefix}/models/Birb-transformed.glb`) as unknown as GLTFResult
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
        <group name="CharacterArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <primitive object={nodes.Body} />
          <primitive object={nodes.Head} />
        </group>
        <group name="Birb_Blob" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <skinnedMesh castShadow receiveShadow name="Birb_Blob_1" geometry={nodes.Birb_Blob_1.geometry} material={materials.PaletteMaterial001} skeleton={nodes.Birb_Blob_1.skeleton} />
          <skinnedMesh castShadow receiveShadow name="Birb_Blob_2" geometry={nodes.Birb_Blob_2.geometry} material={materials.PaletteMaterial001} skeleton={nodes.Birb_Blob_2.skeleton} />
          <skinnedMesh castShadow receiveShadow name="Birb_Blob_3" geometry={nodes.Birb_Blob_3.geometry} material={materials.PaletteMaterial001} skeleton={nodes.Birb_Blob_3.skeleton} />
          <skinnedMesh castShadow receiveShadow name="Birb_Blob_4" geometry={nodes.Birb_Blob_4.geometry} material={materials.PaletteMaterial001} skeleton={nodes.Birb_Blob_4.skeleton} />
          <skinnedMesh castShadow receiveShadow name="Birb_Blob_5" geometry={nodes.Birb_Blob_5.geometry} material={materials.PaletteMaterial001} skeleton={nodes.Birb_Blob_5.skeleton} />
        </group>
      </group>
    </group>
  )
}
useGLTF.preload(`${prefix}/models/Birb-transformed.glb`)