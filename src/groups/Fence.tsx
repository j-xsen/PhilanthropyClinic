import {Plane} from "@react-three/drei";
import {Material} from "three";

function Fence(props: { position: [number, number, number], mat: Material }) {
    return (
        <Plane castShadow args={[4, 1]}
               material={props.mat}
               rotation={[0,0,0]}
               position={props.position}/>
    )
}

export default Fence;