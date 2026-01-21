import {GoldPlate} from "./GoldPlate.tsx";
import {Container, Content, Text} from "@react-three/uikit";
import {useEffect, useState} from "react";
import {Html} from "@react-three/drei";
import {Dollar} from "./Dollar.tsx";
import type {ThreeEvent} from "@react-three/fiber";

export default function LoginOrDonateMenu(props:{panelState:boolean, setPanelState:(state:boolean)=>void}) {

    const [isVisible, setIsVisible] = useState<boolean>(props.panelState || false);
    const [btnOne, setBtnOne] = useState<boolean>(false);
    const [btnFive, setBtnFive] = useState<boolean>(false);
    const [btnTen, setBtnTen] = useState<boolean>(false);

    // exit
    const [exitColor, setExitColor] = useState<string>("#f00");
    const exitMouseEnter = () => {
        setExitColor("#ef5b5b")
        document.body.style.cursor = "pointer";
    }
    const exitMouseExit = () => {
        setExitColor("#f00")
        document.body.style.cursor = "default";
    }
    const exitMouseDown = () => {
        setExitColor("#7e1919")
    }
    const exitFunc = () => {
        setIsVisible(false);
        props.setPanelState(false);
    }

    // visibility
    useEffect(() => {
        setIsVisible(props.panelState);
    },[props.panelState])
    if (!isVisible) {
        return <></>
    }

    const amountBtnClick = (e: ThreeEvent<MouseEvent>) => {
        // clear all
        const selected = e.eventObject.name
        let allOff = false
        if (btnOne){
            if (selected=="1") allOff = true;
            setBtnOne(false);
        }
        if (btnFive){
            if (selected=="5") allOff = true;
            setBtnFive(false);
        }
        if (btnTen){
            if (selected=="10") allOff = true;
            setBtnTen(false);
        }
        if (allOff) return
        if (selected == "1"){
            setBtnOne(true);
        }
        else if (selected == "5") {
            setBtnFive(true);
        }
        else if (selected == "10") {
            setBtnTen(true);
        }

    }

    const dollarScale = 0.05
    return <>
        <group position={[0,0,2.9]}>
        <GoldPlate/>
            <Dollar amount={1} position={[-0.4,-0.2,0.5]} rotation={[1.35,0,-.3]} scale={dollarScale} onClick={amountBtnClick} pressed={btnOne}/>
            <Dollar amount={5} position={[-0.2,-0.2,0.5]} rotation={[1.35,0,-.2]} scale={dollarScale} onClick={amountBtnClick} pressed={btnFive}/>
            <Dollar amount={10} position={[0,-0.2,0.5]} rotation={[1.35,0,0]} scale={dollarScale} onClick={amountBtnClick} pressed={btnTen}/>
        </group>
    <group position={[0, 0, 3.1]}>
        <Container width={132} marginTop={-3.5}>
            <Container marginRight={3}>
            <Text color={"#ddd"} fontSize={6} marginRight={2} marginLeft={2}>EMAIL:</Text>
                <Content>
                <Html>
                    <form style={{width:"100%", marginTop:-5}}>
                        <input style={{width:175, backgroundColor: "rgba(68,68,68,0.2)", border: "hidden", fontSize:18, padding:"5px", color:"#fff"}} name={"email"} type={"email"} placeholder={"email@email.com"}></input>
                    </form>
                </Html>
                </Content>
            </Container>
        </Container>
        <group position={[.55,-.05,0.2]}>
        <Container backgroundColor={exitColor} width={10} height={10} positionType={"absolute"} positionTop={-65} onPointerEnter={exitMouseEnter} onPointerLeave={exitMouseExit} onPointerDown={exitMouseDown} onPointerUp={exitMouseExit} onClick={exitFunc}>
            <Text fontWeight={"bold"} marginLeft={1.5} color={"white"} fontSize={9}>X</Text>
        </Container>
        </group>
    </group>
    </>;
}