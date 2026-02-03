import {Cloud, Clouds} from "@react-three/drei";
import {MeshStandardMaterial} from "three";
import {useRef} from "react";
import {useFrame} from "@react-three/fiber";

function AnimatedClouds(){

    const cloudOne = useRef(null);
    const cloudTwo = useRef(null);
    const cloudThree = useRef(null);
    const cloudFour = useRef(null);
    const cloudFive = useRef(null);
    const clouds = useRef(null);

    const xHi = 10

    useFrame(() => {
        if (!cloudOne.current) return;
        if (!cloudTwo.current) return;
        if (!cloudThree.current) return;
        if (!cloudFour.current) return;
        if (!cloudFive.current) return;

        cloudOne.current.position.x += 0.1
        cloudTwo.current.position.x += 0.1
        cloudThree.current.position.x += 0.1
        cloudFour.current.position.x += 0.1
        cloudFive.current.position.x += 0.1

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
     <Clouds material={MeshStandardMaterial} position={[0,17,-15]} ref={clouds}>
         <Cloud position={[0,0,0]} ref={cloudOne}/>
         <Cloud position={[-20,-5,0]} ref={cloudTwo}/>
         <Cloud position={[-15,-1,0]} ref={cloudThree}/>
         <Cloud position={[-5,-8,-1]} ref={cloudFour}/>
         <Cloud position={[15,-4,0]} ref={cloudFive}/>
     </Clouds>
 )
}

export default AnimatedClouds