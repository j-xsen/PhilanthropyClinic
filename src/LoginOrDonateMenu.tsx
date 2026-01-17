import {GoldPlate} from "./GoldPlate.tsx";
import {Container, Input, Text} from "@react-three/uikit";
import {useEffect, useState} from "react";

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
    <group position={[0, 0, 3.25]}>
        <GoldPlate position={[0,0,-0.2]}/>
        <Container width={132} marginTop={-3.5}>
            <Container marginRight={3}>
            <Text color={"#ddd"} fontSize={6} marginRight={2} marginLeft={2}>EMAIL:</Text>
            </Container>
        </Container>
        <group position={[-.025, 0.05, -.1]}>
            <Container overflow={"scroll"} scrollbarWidth={2} height={12} maxWidth={90} paddingTop={2}>
                <Container backgroundColor={"#111"} opacity={0.25} width={80} positionType={"absolute"} positionLeft={2} positionBottom={0} height={10}/>
                <Input fontSize={7} maxWidth={82} width={82} placeholder={"email@email.com"} caretWidth={1} color={"#ccc"} selectionColor={"#e49624"} caretColor={"#ccc"} marginLeft={2}/>
            </Container>
        </group>
        <group position={[.55,-.05,0.2]}>
        <Container backgroundColor={exitColor} width={10} height={10} positionType={"absolute"} positionTop={-65} onPointerEnter={exitMouseEnter} onPointerLeave={exitMouseExit} onPointerDown={exitMouseDown} onPointerUp={exitMouseExit} onClick={exitFunc}>
            <Text fontWeight={"bold"} marginLeft={1.5} color={"white"} fontSize={9}>X</Text>
        </Container>
        </group>
    </group>
    </>;
}