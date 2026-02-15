import {GoldPlate} from "../models/GoldPlate.tsx";
import {Container, Content, Text} from "@react-three/uikit";
import {type ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {Html, useKTX2} from "@react-three/drei";
import {Dollar} from "../models/Dollar.tsx";
import type {ThreeEvent} from "@react-three/fiber";
import {Light} from "../models/Light.tsx";
import {type EmailState, OFF, VALID} from "../EmailState.tsx";

export default function LoginOrDonateMenu(props:{panelState:boolean, setPanelState:(state:boolean)=>void}) {

    const [isVisible, setIsVisible] = useState<boolean>(props.panelState || false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

    const [emailValid, setEmailValid] = useState<EmailState>(OFF);

    // exit
    const [exitColor, setExitColor] = useState<string>("#9a1212");
    const exitMouseEnter = useCallback(() => {
        setExitColor("#d60b0b")
        document.body.style.cursor = "pointer";
    },[])
    const exitMouseExit = useCallback(() => {
        setExitColor("#9a1212")
        document.body.style.cursor = "default";
    },[])
    const exitMouseDown = useCallback(() => {
        setExitColor("#7e1919")
    },[])
    const {setPanelState} = props
    const exitFunc = useCallback(() => {
        setIsVisible(false);
        setPanelState(false);
    },[setPanelState])

    const updateInput = useCallback((e:ChangeEvent<HTMLInputElement>) => {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        setEmailValid(pattern.test(e.target.value) ? VALID : OFF)
    },[])

    const [oneMap, fiveMap, tenMap, submitMap] = useKTX2(['/textures/1dollar.ktx2',
        "/textures/5dollar.ktx2",
        "/textures/10dollar.ktx2",
        "/textures/submit.ktx2"])
    const [emitOne, emitFive, emitTen] = useKTX2(['/textures/blank1dollar.ktx2',
        '/textures/blank5dollar.ktx2',
        "/textures/blank10dollar.ktx2"])

    const emailInput = useMemo(() => (
        <Html>
            <form style={{width:"100%", marginTop:-5}} onSubmit={()=>{}}>
                <input onInput={updateInput} style={{width:175, backgroundColor: "rgba(68,68,68,0.2)", border: "hidden", fontSize:18, padding:"5px", color:"#fff"}} name={"email"} type={"email"} placeholder={"email@email.com"}></input>
            </form>
        </Html>
    ),[updateInput])

    useEffect(() => {
        setIsVisible(props.panelState);
    },[props.panelState])

    if (!isVisible) {
        return <></>
    }

    const amountBtnClick = (e: ThreeEvent<MouseEvent>) => {
        const selected = parseInt(e.eventObject.name)
        setSelectedAmount(prev=>prev===selected?null:selected)
    }

    if(!oneMap || !fiveMap || !tenMap || !submitMap || !emitOne || !emitFive || !emitTen) return <></>

    return <>
        <group position={[0,0,2.9]}>
        <GoldPlate/>
            <Dollar amount={1} position={[-0.4,-0.2,0.5]} rotation={[1.35,0,-.3]} onClick={amountBtnClick} pressed={selectedAmount===1} map={oneMap} emit={emitOne}/>
            <Dollar amount={5} position={[-0.2,-0.2,0.5]} rotation={[1.35,0,-.2]} onClick={amountBtnClick} pressed={selectedAmount===5} map={fiveMap} emit={emitFive}/>
            <Dollar amount={10} position={[0,-0.2,0.5]} rotation={[1.35,0,0]} onClick={amountBtnClick} pressed={selectedAmount===10} map={tenMap} emit={emitTen}/>
            <Dollar amount={99} position={[.3,-0.2,0.5]} rotation={[1.35,0,.1]} onClick={amountBtnClick} pressed={emailValid===OFF} map={submitMap}/>
            <Light emailValid={emailValid} scale={0.045} rotation={[0,1.56,1.56]} position={[0.55,0.05,.17]}/>
        </group>
    <group position={[0, 0, 3.1]}>
        <Container width={132} marginTop={-3.5}>
            <Container marginRight={3}>
            <Text color={"#ddd"} fontSize={6} marginRight={2} marginLeft={2}>EMAIL:</Text>
                <Content>
                    {emailInput}
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

useKTX2.preload("/textures/1dollar.ktx2")
useKTX2.preload("/textures/5dollar.ktx2")
useKTX2.preload("/textures/10dollar.ktx2")
useKTX2.preload("/textures/submit.ktx2")
useKTX2.preload("/textures/blank1dollar.ktx2")
useKTX2.preload("/textures/blank5dollar.ktx2")
useKTX2.preload("/textures/blank10dollar.ktx2")
