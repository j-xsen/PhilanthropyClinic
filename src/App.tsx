import './App.css'
import {Canvas} from "@react-three/fiber";
import {PiggyBank} from "./PiggyBank.tsx";
import {CameraControls, Environment, Plane} from "@react-three/drei";
import {Carrot} from "./Carrot.tsx";

function App() {
  return (
      <div id={"canvas-container"}>
          <Canvas>
              <CameraControls/>
              <PiggyBank position={[0,-3,-4]} rotation={[0,0.5,0]}/>
              <Carrot position={[0,2,-4]}/>
              <Environment files={"studio_small_02_1k.exr"}/>
              <Plane args={[20,20]} rotation={[-1.5,0,0]} position={[0,-4,-4]}>
                  <meshStandardMaterial color={[0,0.25,0]}/>
              </Plane>
          </Canvas>
      </div>
  )
}

export default App
