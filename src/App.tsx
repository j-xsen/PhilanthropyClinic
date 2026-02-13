import './App.css'
import {Canvas} from "@react-three/fiber";
import {PiggyBank} from "./models/PiggyBank.tsx";
import {DragControls, Sky} from "@react-three/drei";
import {Carrot} from "./models/Carrot.tsx";
import {Matrix4} from "three";
import {Suspense, useMemo, useRef, useState} from "react";
import {type CollisionPayload, Physics, RapierRigidBody, RigidBody, vec3} from "@react-three/rapier";
import {Jail} from "./models/Jail.tsx";
import {Dollar} from "./models/Dollar.tsx";
import {GoldPlate} from "./models/GoldPlate.tsx";
import {Light} from "./models/Light.tsx";
import AnimatedClouds from "./groups/AnimatedClouds.tsx";
import {CheckoutProvider} from "@stripe/react-stripe-js/checkout";
import {loadStripe} from "@stripe/stripe-js";
import Grass from "./groups/Grass.tsx";
import Fences from "./groups/Fences.tsx";
import PlaceCard from "./groups/PlaceCard.tsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY)

function App() {
    const [jailState,] = useState<boolean>(false);
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

    const pig_collide = (payload: CollisionPayload) => {
        if (payload.other.rigidBodyObject?.name === "carrot") {
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

    const promise = useMemo(async () => {
        const res = await fetch('/api/actions/checkout', {
            method: 'POST',
        });
        const data = await res.json();
        return data.clientSecret;
    }, [])

    return (
        <div id={"canvas-container"}>
            <CheckoutProvider stripe={stripePromise} options={{clientSecret: promise}}>
                <Canvas gl={{localClippingEnabled: true}} shadows>
                    <Suspense>
                        <Sky rayleigh={0.5} turbidity={10} sunPosition={[0, 1, 10]}/>
                        <AnimatedClouds/>
                        <group visible={false}>
                            <Light emailValid={0}/>
                            <Dollar amount={0} pressed={false}/>
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
                            <Jail position={[0, 2, -4]} rotation={[0.1, 0, 0]}/>
                            <DragControls autoTransform={false} axisLock="z" onDrag={check_carrot_on_pig}>
                                <RigidBody name={"carrot"} position={[0, 2, -4]} colliders={"cuboid"} gravityScale={0}
                                           ref={carrotRef} sensor>
                                    <Carrot jailState={jailState}/>
                                </RigidBody>
                            </DragControls>
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
            </CheckoutProvider>
        </div>
    )
}

export default App
