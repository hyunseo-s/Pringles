import { Center, OrbitControls } from "@react-three/drei";
import { LightRail, Map } from "./models";
import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';
import useModelStore from "../../store/useModelStore";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { INITIAL_CAMERA_POSITION } from "../../constants";
import { useControls } from 'leva';

export default function Experience()
{
	// const scroll = useScroll();
	const cameraPosition = INITIAL_CAMERA_POSITION

	
	useFrame((state) => {
		const newCameraPosition = new THREE.Vector3(
			cameraPosition.x,
			cameraPosition.y, 
			cameraPosition.z
		);
		state.camera.position.lerp(newCameraPosition, 0.5);
	});


	return (
		<>
			{/* {<OrbitControls /> } */}
			<EffectComposer>
				<ToneMapping mode={ ToneMappingMode.ACES_FILMIC } />
			</EffectComposer>
			<Center>
				<LightRail />
				<Map rotation={[0, Math.PI/2, 0]} />
			</Center>
		</>
	)
}