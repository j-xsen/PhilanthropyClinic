import Fence from "./Fence.tsx"
import {useKTX2} from "@react-three/drei";
import {useMemo} from "react";
import {DoubleSide, MeshStandardMaterial} from "three";

function Fences({...props}) {
    const xSpacing = 3.9

    const [fenceMap] = useKTX2([
        '/textures/fence.ktx2',
    ])

    const fenceMat = useMemo(() => {
        return new MeshStandardMaterial({
            map: fenceMap,
            transparent: true,
            alphaTest:0.5,
            side: DoubleSide
        })
    }, [fenceMap])

    return (
        <group scale={1.5} {...props}>
            <Fence position={[-3 * xSpacing, 0, 0]} mat={fenceMat}/>
            <Fence position={[-2 * xSpacing, 0, 0]} mat={fenceMat}/>
            <Fence position={[-xSpacing, 0, 0]} mat={fenceMat}/>
            <Fence position={[0, 0, 0]} mat={fenceMat}/>
            <Fence position={[xSpacing, 0, 0]} mat={fenceMat}/>
            <Fence position={[2 * xSpacing, 0, 0]} mat={fenceMat}/>
            <Fence position={[3 * xSpacing, 0, 0]} mat={fenceMat}/>
        </group>
    )
}

export default Fences