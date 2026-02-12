import {useKTX2} from "@react-three/drei";
import {useMemo} from "react";
import * as THREE from "three";
import {DoubleSide} from "three";

function PlaceCard({...props}){
    const [placeCardMap] = useKTX2([
        '/textures/bank.ktx2',
    ])

    const cardMat = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            map: placeCardMap,
            side:DoubleSide
        })
    }, [placeCardMap])

    return(
        <group {...props} scale={.5}>
            <mesh castShadow material={cardMat} rotation={[-.2,0,0]}>
                <planeGeometry args={[4,1]}/>
            </mesh>
        </group>
    )
}

export default PlaceCard;
