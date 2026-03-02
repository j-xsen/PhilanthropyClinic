import {GoldPlate} from "../models/GoldPlate.tsx";
import {Container, Content, Text} from "@react-three/uikit";
import {type ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {Html, useKTX2} from "@react-three/drei";
import {Dollar} from "../models/Dollar.tsx";
import {Light} from "../models/Light.tsx";
import {type EmailState, OFF, VALID} from "../EmailState.tsx";
import {A11y} from "@react-three/a11y";

export default function LoginOrDonateMenu(props:{panelState:boolean, setPanelState:(state:boolean)=>void}) {

    const [isVisible, setIsVisible] = useState<boolean>(props.panelState || false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

    const [emailValid, setEmailValid] = useState<EmailState>(OFF);

    // exit
    const [exitColor, setExitColor] = useState<string>("#9a1212");
    const exitMouseEnter = useCallback(() => {
        setExitColor("#d60b0b")
    },[])
    const exitMouseExit = useCallback(() => {
        setExitColor("#9a1212")
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

    const handleSubmit = useCallback(async () => {
        if(emailValid!==VALID || !selectedAmount) return
        await fetch("/api/checkout", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: (document.querySelector('input[name="email"]') as HTMLInputElement).value,
                amount: selectedAmount
            })
        }).then(res => res.json()).then(data => {
            if(data.url) window.location.href = data.url
        })
    },[emailValid, selectedAmount])

    const emailInput = useMemo(() => (
        <Html>
            <form style={{width:"100%", marginTop:-5}} onSubmit={handleSubmit}>
                <input onInput={updateInput} style={{width:175, backgroundColor: "rgba(68,68,68,0.2)", border: "hidden", fontSize:18, padding:"5px", color:"#fff"}} name={"email"} type={"email"} aria-label={"Email"} placeholder={"email@email.com"}></input>
            </form>
        </Html>
    ),[handleSubmit, updateInput])

    useEffect(() => {
        setIsVisible(props.panelState);
    },[props.panelState])

    const selectOne = useCallback(() => setSelectedAmount(prev=>prev===1?null:1),[])
    const selectFive = useCallback(() => setSelectedAmount(prev=>prev===5?null:5),[])
    const selectTen = useCallback(() => setSelectedAmount(prev=>prev===10?null:10),[])

    if (!isVisible) {
        return <></>
    }

    if(!oneMap || !fiveMap || !tenMap || !submitMap || !emitOne || !emitFive || !emitTen) return <></>

    return <>
        <group position={[0,0,2.9]}>
        <GoldPlate/>
            <A11y role={"togglebutton"} description={"$1 donation button."} actionCall={selectOne}>
                <Dollar amount={1} position={[-0.4,-0.2,0.5]} rotation={[1.35,0,-.3]} pressed={selectedAmount===1} textMap={oneMap} emit={emitOne}/>
            </A11y>
            <A11y role={"togglebutton"} description={"$5 donation"} actionCall={selectFive}>
                <Dollar amount={5} position={[-0.2,-0.2,0.5]} rotation={[1.35,0,-.2]} pressed={selectedAmount===5} textMap={fiveMap} emit={emitFive}/>
            </A11y>
            <A11y role={"togglebutton"} description={"$10 donation"} actionCall={selectTen}>
                <Dollar amount={10} position={[0,-0.2,0.5]} rotation={[1.35,0,0]} pressed={selectedAmount===10} textMap={tenMap} emit={emitTen}/>
            </A11y>
            <A11y role={"button"} description={"Submit donation form."} actionCall={handleSubmit}>
                <Dollar amount={99} position={[.3,-0.2,0.5]} rotation={[1.35,0,.1]} pressed={emailValid===OFF||!selectedAmount} textMap={submitMap}/>
            </A11y>
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
            <A11y role={"button"} description={"Exit button. Closes the donation menu."} actionCall={exitFunc}
            a11yElStyle={{position:"absolute", top:-175}}>
        <Container backgroundColor={exitColor} width={10} height={10} positionType={"absolute"} positionTop={-65} onPointerEnter={exitMouseEnter} onPointerLeave={exitMouseExit} onPointerDown={exitMouseDown} onPointerUp={exitMouseExit} >
            <Text fontWeight={"bold"} marginLeft={1.5} color={"white"} fontSize={9}>X</Text>
        </Container>
        </A11y>
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
