import { create } from 'zustand';
import * as THREE from 'three';
import { RefObject } from 'react';

interface ModelStore {
  lightRail: RefObject<THREE.Object3D> | null;
  setLightRail: (lightRail: RefObject<THREE.Object3D>) => void;
}

const useModelStore = create<ModelStore>((set) => ({
  lightRail: null,
	setLightRail: (lightRail) => set(() => ({ lightRail: lightRail })),
}));

export default useModelStore;