import Experience from "./Experience";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { INITIAL_CAMERA_POSITION } from "../../constants";

export default function University(props: CanvasProps) {
	return (
		<Canvas
			{...props}
			shadows
			orthographic
			camera={ {
					near: 0.1,
					far: 100,
					zoom: 14,
					position: INITIAL_CAMERA_POSITION,
			} }
		>
			<ambientLight />
			<Experience />
		</Canvas>
	)
}