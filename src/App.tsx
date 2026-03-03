import './App.css'
import {Canvas} from "@react-three/fiber";
import {PiggyBank} from "./models/PiggyBank.tsx";
import {DragControls, Sky} from "@react-three/drei";
import {Carrot} from "./models/Carrot.tsx";
import {Matrix4} from "three";
import {Suspense, useCallback, useEffect, useRef, useState} from "react";
import {type CollisionPayload, Physics, RapierRigidBody, RigidBody, vec3} from "@react-three/rapier";
import {Jail} from "./models/Jail.tsx";
import {GoldPlate} from "./models/GoldPlate.tsx";
import {Light} from "./models/Light.tsx";
import AnimatedClouds from "./groups/AnimatedClouds.tsx";
import Grass from "./groups/Grass.tsx";
import Fences from "./groups/Fences.tsx";
import PlaceCard from "./groups/PlaceCard.tsx";
import { Analytics } from "@vercel/analytics/react";
import {A11yAnnouncer} from "@react-three/a11y";

function App() {
    const [jailState,setJailState] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [carrotAte, setCarrotAte] = useState<boolean>(false);
    const check_carrot_on_pig = (_localMatrix: Matrix4,
                                 deltaLocalMatrix: Matrix4) => {
        if (!jailState) return;
        const cur_carrot_pos = carrotRef.current.translation();
        const new_carrot_pos = vec3({
            x: 0,
            y: cur_carrot_pos.y + deltaLocalMatrix.elements[13] / 50,
            z: -4
        });
        carrotRef.current.setTranslation(new_carrot_pos, true);
    }

    const [curAnim, setCurAnim] = useState<"Breathe" | "Jump">("Breathe")
    const [verifyResponse, setVerifyResponse] = useState<Response & {success:boolean} | null>(null);

    const verifySessionId = useCallback(async () => {
        return await fetch("/api/verify", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: sessionId
            })
        })
    },[sessionId])

    useEffect(()=>{
        if(verifyResponse && verifyResponse.success) {
            setJailState(true)
        }
    },[verifyResponse])

    useEffect(() => {
        if(!sessionId) return
        verifySessionId().then((res) => res.json()).then((res) => {
            setVerifyResponse(res);
        })
    },[sessionId, verifySessionId])

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('id')) {
            setSessionId(urlParams.get('id'))
        }
    },[])

    const pig_collide = (payload: CollisionPayload) => {
        if (payload.other.rigidBodyObject?.name === "carrot") {
            setCarrotAte(true);
            document.body.style.cursor = "default";
            setCurAnim("Jump");
        }
    }

    const pig_end_collide = (payload: CollisionPayload) => {
        if (payload.other.rigidBodyObject?.name === "carrot") {
            setCurAnim("Breathe");
        }
    }

    const piggyRigidRef = useRef<RapierRigidBody>(null!);
    const piggyRef = useRef(null!);
    const carrotRef = useRef<RapierRigidBody>(null!);
    const canvasRef = useRef<HTMLDivElement>(null);

    return (
        <div id={"canvas-container"} ref={canvasRef} role={"presentation"}>
            <Canvas gl={{localClippingEnabled: true}} shadows role={"region"}
                    aria-label={"3D scene showing a Pig and a carrot in jail"}>
                <Suspense fallback={null}>
                    <Sky rayleigh={0.5} turbidity={10} sunPosition={[0, 1, 10]}/>
                    <AnimatedClouds/>
                    <group visible={false}>
                        <Light emailValid={0}/>
                        <GoldPlate/>
                    </group>
                    <Fences position={[0, -2.67, -12]}/>
                    <PlaceCard position={[-1, -3.9, -1.25]} rotation={[-.3, -.1, 0]}/>
                    <Physics>
                        <RigidBody colliders={"cuboid"} name={"piggy"} ref={piggyRigidRef}
                                   onIntersectionEnter={pig_collide} onIntersectionExit={pig_end_collide}>
                            <PiggyBank ref={piggyRef} castShadow curAnim={curAnim} position={[0, -2, -4]}
                                       rotation={[0, 0.5, 0]}/>
                        </RigidBody>
                        {!jailState &&
                        <Jail position={[0, 2, -4]} rotation={[0.1, 0, 0]}/>
                        }
                        {!carrotAte &&
                        <DragControls autoTransform={false} axisLock="z" onDrag={check_carrot_on_pig}>
                            <RigidBody name={"carrot"} position={[0, 2, -4]} colliders={"cuboid"} gravityScale={0}
                                       ref={carrotRef} sensor>
                                <Carrot jailState={jailState}/>
                            </RigidBody>
                        </DragControls>
                        }
                        <RigidBody name="plane" colliders={"cuboid"} restitution={0}>
                            <Grass/>
                        </RigidBody>
                    </Physics>
                    <ambientLight intensity={0.5}/>
                    <directionalLight castShadow
                                      position={[2, 10, 5]}
                                      intensity={5}
                                      shadow-mapSize-width={1024}
                                      shadow-mapSize-height={1024}
                                      shadow-camera-left={-40}
                                      shadow-camera-right={40}
                                      shadow-camera-top={15}
                                      shadow-camera-bottom={-15}
                                      shadow-camera-near={0.1}
                                      shadow-camera-far={50}
                    />
                </Suspense>
            </Canvas>
            <A11yAnnouncer/>
            {typeof window !== "undefined" && <Analytics />}
        </div>
    )
}

export default App
