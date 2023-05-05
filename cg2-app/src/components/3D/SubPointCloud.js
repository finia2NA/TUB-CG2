import { useCallback, useMemo } from "react"
import * as THREE from "three";

import circleImg from "../../asset/circle.png";
import { useLoader } from "react-three-fiber";
import { Point, Points } from "@react-three/drei";
import colors from "./Colors";

function spliceArray(arr, maxSliceLength = 100) {
  const result = [];
  for (let i = 0; i < arr.length; i += maxSliceLength) {
    result.push(arr.slice(i, i + maxSliceLength));
  }
  return result;
}


const SubPointCloud = props => {

  const pointsPerSubSubCloud = 500

  const myColor = colors[props.coloring]

  const slices = spliceArray(props.points, pointsPerSubSubCloud)


  return <>
    {slices.map((slice, sliceIndex) =>
      <Points key={sliceIndex} limit={pointsPerSubSubCloud}>
        <pointsMaterial attach={"material"}
          map={props.texture}
          color={new THREE.Color(Math.random(), Math.random(), Math.random())}
          size={0.001}
          transparent={false}
          alphaTest={0.5}
          opacity={1.0}
          sizeAttenuation />

        {slice.map((p, i) => {
          return <Point key={i} position={p.position} />
        })}

      </Points>
    )}
  </>
}

export default SubPointCloud