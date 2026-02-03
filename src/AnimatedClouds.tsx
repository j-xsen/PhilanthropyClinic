import {Cloud, Clouds} from "@react-three/drei";
import {Group, MeshStandardMaterial} from "three";
import {useRef} from "react";
import {useFrame} from "@react-three/fiber";

function AnimatedClouds(){

    const cloudOne = useRef<Group>(null);
    const cloudTwo = useRef<Group>(null);
    const cloudThree = useRef<Group>(null);
    const cloudFour = useRef<Group>(null);
    const cloudFive = useRef<Group>(null);
    const clouds = useRef<Group>(null);

    const xHi = 30
    const xAdd = 0.01

    useFrame(() => {
        if (!cloudOne.current) return;
        if (!cloudTwo.current) return;
        if (!cloudThree.current) return;
        if (!cloudFour.current) return;
        if (!cloudFive.current) return;

        cloudOne.current.position.x += xAdd
        cloudTwo.current.position.x += xAdd
        cloudThree.current.position.x += xAdd
        cloudFour.current.position.x += xAdd
        cloudFive.current.position.x += xAdd

        if (cloudOne.current.position.x > xHi) {
            cloudOne.current.position.x = -xHi
        }
        if (cloudTwo.current.position.x > xHi) {
            cloudTwo.current.position.x = -xHi
        }
        if (cloudThree.current.position.x > xHi) {
            cloudThree.current.position.x = -xHi
        }
        if (cloudFour.current.position.x > xHi) {
            cloudFour.current.position.x = -xHi
        }
        if (cloudFive.current.position.x > xHi) {
            cloudFive.current.position.x = -xHi
        }
    })

 return (
     <Clouds position={[0,17,-15]} ref={clouds} material={MeshStandardMaterial}>
         <Cloud position={[0,0,0]} ref={cloudOne}/>
         <Cloud position={[-30,-5,0]} ref={cloudTwo}/>
         <Cloud position={[-15,-1,0]} ref={cloudThree}/>
         <Cloud position={[-5,-8,-1]} ref={cloudFour}/>
         <Cloud position={[20,-4,0]} ref={cloudFive}/>
     </Clouds>
 )
}

export default AnimatedClouds