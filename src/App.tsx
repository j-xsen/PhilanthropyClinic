import './App.css'
import {Canvas, useLoader} from "@react-three/fiber";
import {PiggyBank} from "./models/PiggyBank.tsx";
import {DragControls, Environment, Plane, Sky} from "@react-three/drei";
import {Carrot} from "./models/Carrot.tsx";
import {Matrix4, TextureLoader} from "three";
import {Suspense, useMemo, useRef, useState} from "react";
import {type CollisionPayload, Physics, RapierRigidBody, RigidBody, vec3} from "@react-three/rapier";
import {Jail} from "./models/Jail.tsx";
import {Dollar} from "./models/Dollar.tsx";
import {GoldPlate} from "./models/GoldPlate.tsx";
import {Light} from "./models/Light.tsx";
import AnimatedClouds from "./AnimatedClouds.tsx";
import {CheckoutProvider} from "@stripe/react-stripe-js/checkout";
import {loadStripe} from "@stripe/stripe-js";

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

    const grassColorMap = useLoader(TextureLoader, 'textures/grass-color.avif');

    const promise = useMemo(async () => {
        const res = await fetch('/api/actions/checkout', {
            method: 'POST',
        });
        const data = await res.json();
        return data.clientSecret;
    }, [])

    return (
        <div id={"canvas-container"}>
            <CheckoutProvider stripe={stripePromise} options={{clientSecret:promise}}>
            <Canvas gl={{localClippingEnabled: true}}>
                <Suspense>
                    <Sky rayleigh={0.5} turbidity={10} sunPosition={[0, 1, 10]}/>
                    <AnimatedClouds/>
                    <group visible={false}>
                        <Light emailValid={0}/>
                        <Dollar amount={0} pressed={false}/>
                        <GoldPlate/>
                    </group>
                    <Physics>
                        <RigidBody colliders={"cuboid"} name={"piggy"} ref={piggyRigidRef}
                                   onIntersectionEnter={pig_collide} onIntersectionExit={pig_end_collide}>
                            <PiggyBank ref={piggyRef} curAnim={curAnim} position={[0, -2, -4]} rotation={[0, 0.5, 0]}/>
                        </RigidBody>
                        <Jail position={[0, 2, -4]} rotation={[0.1, 0, 0]}/>
                        <DragControls autoTransform={false} axisLock="z" onDrag={check_carrot_on_pig}>
                            <RigidBody name={"carrot"} position={[0, 2, -4]} colliders={"cuboid"} gravityScale={0}
                                       ref={carrotRef} sensor>
                                <Carrot jailState={jailState}/>
                            </RigidBody>
                        </DragControls>
                        <RigidBody name="plane" colliders={"cuboid"} restitution={0}>
                            <Plane args={[60, 20]} rotation={[-1.5, 0, 0]} position={[0, -4, -4]}>
                                <meshStandardMaterial color={[0, 0.25, 0]} map={grassColorMap}/>
                            </Plane>
                        </RigidBody>
                    </Physics>
                </Suspense>
                <Environment files={"studio_small_02_1k.exr"}/>
            </Canvas>
            </CheckoutProvider>
        </div>
    )
}

export default App
