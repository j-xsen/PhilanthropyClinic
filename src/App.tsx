import './App.css'
import {Canvas} from "@react-three/fiber";
import {Pig} from "./Pig.tsx";
import {CameraControls, Environment, Plane} from "@react-three/drei";
import {Carrot} from "./Carrot.tsx";

function App() {
  return (
      <div id={"canvas-container"}>
          <Canvas>
              <CameraControls/>
              <Pig position={[0,-1,0]} rotation={[0,0.5,0]}/>
              <Carrot position={[0,0,0]}/>
              <Environment files={"studio_small_02_1k.exr"}/>
              <Plane args={[10,10]} rotation={[-1.5,0,0]} position={[0,-1.6,0]}>
                  <meshStandardMaterial color={[0,0.25,0]}/>
              </Plane>
          </Canvas>
      </div>
  )
}

export default App
