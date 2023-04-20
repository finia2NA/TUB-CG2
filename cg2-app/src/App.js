import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { OrbitControls, Point } from '@react-three/drei';

function App() {

  // generate 20 random point locations between -1 and 1
  let pointCoordinates = [];
  for (let i = 0; i < 20; i++) {
    pointCoordinates.push([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]);
  }

  const particlesCount = 100;
  const particlePositions = new Float32Array(particlesCount * 3);

  function Point(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()

    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 0.15 : 0.1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <sphereGeometry args={[1, 32, 32]} /> {/* array: [radius, widthSegments, heightSegments] */}
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }


  return (
    // canvas of size 80% screen
    <Canvas camera={{ position: [0, 0, 2] }} style={{ width: '80vw', height: '80vh', background: "grey" }} >
      <ambientLight />

      {/* point cloud */}
      {pointCoordinates.map((point, index) => (
        <Point key={index} position={point} />
      ))}



      <OrbitControls enablePan={false} />
    </Canvas>
  );
}

export default App;