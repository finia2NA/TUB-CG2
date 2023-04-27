import { Suspense, useMemo } from "react"
import * as THREE from "three";

import circleImg from "../../asset/circle.png";
import { useLoader } from "react-three-fiber";


const PointCloud = (props) => {
  const CircleImg = useLoader(THREE.TextureLoader, circleImg);

  // Use "useMemo" to create an array of positions for each point in the grid.
  let positions = useMemo(() => {
    const points = props.points.getAllPoints()

    let positions = [];
    for (let i = 0; i < points.length; i++) {
      const thePoint = points[i]
      positions.push(...thePoint.position)
    }

    return new Float32Array(positions); // Create an array that is compatible with "bufferAttribute".
  }, [props.points]);

  console.log(positions)

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position" // The attribute parameter that will be controlled.
          array={positions}
          count={positions.length / 3} // The count is divided by 3 because each array type axis will contain 3 values in the 1D array.
          itemSize={3} // It is known that each array type axis will contain 3 values in the 1D array.
        />
      </bufferGeometry>
      <pointsMaterial
        attach="material"
        map={CircleImg}
        color={0x00aaff}
        sizes={0.005}
        sizeAttenuation // This parameter scales the object based on the perspective camera.
        transparent={false}
        alphaTest={0.5} // This is the threshold when rendering to prevent opacity below the alpha test value.
        opacity={1.0}
      />
    </points>
  );

}

export default PointCloud