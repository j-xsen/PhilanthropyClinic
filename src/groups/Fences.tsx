import Fence from "./Fence.tsx"
import {useKTX2} from "@react-three/drei";
import {useEffect} from "react";
import {SRGBColorSpace} from "three";

function Fences(){
    const xSpacing=3.9

    const [fenceMap] = useKTX2([
        '/textures/fence.ktx2',
    ])

    useEffect(() => {
        fenceMap.colorSpace=SRGBColorSpace
        fenceMap.needsUpdate=true
    },[fenceMap])

    return(
        <group position={[0,-1.5,-6]} scale={1.5}>
            <Fence position={[-3*xSpacing,0,0]} map={fenceMap}/>
            <Fence position={[-2*xSpacing,0,0]} map={fenceMap}/>
            <Fence position={[-xSpacing,0,0]} map={fenceMap}/>
            <Fence position={[0,0,0]} map={fenceMap}/>
            <Fence position={[xSpacing,0,0]} map={fenceMap}/>
            <Fence position={[2*xSpacing,0,0]} map={fenceMap}/>
            <Fence position={[3*xSpacing,0,0]} map={fenceMap}/>
        </group>
    )
}

export default Fences