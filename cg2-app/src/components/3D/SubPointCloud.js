import { useCallback, useMemo } from "react"
import * as THREE from "three";

import circleImg from "../../asset/circle.png";
import { useLoader } from "react-three-fiber";
import { Point, Points } from "@react-three/drei";

const SubCloud = props => {
  const CircleImg = useLoader(THREE.TextureLoader, circleImg);
  const vertexSize = 0.02

  const positions = useMemo(() => {
    const positionsArray = [];
    for (let i = 0; i < props.points.length; i++) {
      const thePoint = props.points[i]

      positionsArray.push(...thePoint.position)
    }

    return new Float32Array(positionsArray);
  }, [props.points]);

  console.log("rendering subcloud")

  const onClick = useCallback((e) => {
    if (e.distanceToRay < vertexSize / 2) {
      console.log(e.point)
      props.handlePointClick(e.point)
    }
  }, [props])

  if (props.logging) {
    console.log(positions)
  }

  // return (
  //   <points onClick={onClick}>
  //     <bufferGeometry attach="geometry">
  //       <bufferAttribute
  //         attach="attributes-position" // The attribute parameter that will be controlled.
  //         array={positions}
  //         count={positions.length / 3} // The count is divided by 3 because each array type axis will contain 3 values in the 1D array.
  //         itemSize={3} // It is known that each array type axis will contain 3 values in the 1D array.

  //         // update when the points change
  //         onUpdate={(self) => {
  //           self.needsUpdate = true; // Needed for the attribute to be updated.
  //         }}
  //       />
  //     </bufferGeometry>
  //     <pointsMaterial
  //       attach="material"
  //       map={CircleImg}
  //       color={props.color}
  //       size={vertexSize}
  //       transparent={false}
  //       alphaTest={0.5}
  //       opacity={1.0}
  //     />
  //   </points>
  // );

  return (
    <Points limit={1000} // Optional: max amount of items (for calculating buffer size)
      range={1000}>
      <pointsMaterial attach={"material"}
        map={CircleImg}
        color={props.color}
        size={1} 
        transparent={false}
        alphaTest={0.5}
        opacity={1.0} />

      <Point position={[0, 0, 0]} color="red" onClick={() => console.log("hi")} />

      {/* {props.points.map((point, index) => {
        return (
          // <Point key={index} position={point.position} color={props.color} />
          <Point position={[0, 0, 0]} color="red" onClick={() => console.log("hi")} />
        )
      })} */}
    </Points>
  )
}

export default SubCloud