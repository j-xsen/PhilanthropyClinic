import {Plane} from "@react-three/drei";
import {Texture} from "three";

function Fence(props: { position: [number, number, number], map: Texture }) {
    return (
        <Plane args={[4, 1]} rotation={[0, 0, 3.14]} position={props.position}>
            <meshStandardMaterial map={props.map} transparent={true}/>
        </Plane>
    )
}

export default Fence;