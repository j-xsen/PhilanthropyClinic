import {Plane, useKTX2} from "@react-three/drei";

function Grass (){
    const [grassMap] = useKTX2([
        '/textures/grass.ktx2',
    ])
    return(
    <Plane receiveShadow args={[60, 20]} rotation={[-1.5, 0, 0]} position={[0, -4, -4]}>
        <meshStandardMaterial color={[0, .7, 0]} map={grassMap}/>
    </Plane>
    )
}

export default Grass