import {GoldPlate} from "./GoldPlate.tsx";
import {Container, Text} from "@react-three/uikit";
import {useEffect, useState} from "react";
import {Html} from "@react-three/drei";

export default function LoginOrDonateMenu(props:{panelState:boolean, setPanelState:(state:boolean)=>void}) {

    const [exitColor, setExitColor] = useState<string>("#f00");

    const [isVisible, setIsVisible] = useState<boolean>(props.panelState || false);

    const exitMouseEnter = () => {
        setExitColor("#ef5b5b")
    }

    const exitMouseExit = () => {
        setExitColor("#f00")
    }

    const exitMouseDown = () => {
        setExitColor("#7e1919")
    }

    const exitFunc = () => {
        setIsVisible(false);
        props.setPanelState(false);
    }

    useEffect(() => {
        setIsVisible(props.panelState);
    },[props.panelState])

    if (!isVisible) {
        return <></>
    }

    return <>
    <group position={[0, 0, 3]}>
        <GoldPlate position={[0,0,-0.2]}/>
        <Container width={132} marginTop={-3.5}>
            <Container marginRight={3}>
            <Text color={"#ddd"} fontSize={6} marginRight={2} marginLeft={2}>EMAIL:</Text>
            </Container>
        </Container>
        <group>
                <Html>
                    <form style={{width:"100%", marginLeft:"-51%", marginTop:"-2rem"}}>
                    <input style={{width:200, backgroundColor: "rgba(68,68,68,0.2)", border: "hidden", fontSize:23, padding:"5px", color:"#fff"}} name={"email"} type={"email"} placeholder={"email@email.com"}></input>
                    </form>
                </Html>
        </group>
        <group position={[.55,-.05,0.2]}>
        <Container backgroundColor={exitColor} width={10} height={10} positionType={"absolute"} positionTop={-65} onPointerEnter={exitMouseEnter} onPointerLeave={exitMouseExit} onPointerDown={exitMouseDown} onPointerUp={exitMouseExit} onClick={exitFunc}>
            <Text fontWeight={"bold"} marginLeft={1.5} color={"white"} fontSize={9}>X</Text>
        </Container>
        </group>
    </group>
    </>;
}