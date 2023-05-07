import { useCallback, useMemo } from "react"
import * as THREE from "three";

import circleImg from "../../asset/circle.png";
import { useLoader } from "react-three-fiber";
import { Point, Points } from "@react-three/drei";
import colors from "./Colors";

const logging = false

const SubPointCloud = props => {

  // the <Points/> tag can only handle a limited number of points, so we need to split the point cloud into smaller sub clouds
  // this function splits the array into smaller arrays
  function spliceArray(arr, maxSliceLength = 100) {
    const result = [];
    for (let i = 0; i < arr.length; i += maxSliceLength) {
      result.push(arr.slice(i, i + maxSliceLength));
    }
    if(logging) console.log(props.coloring + ": using " + result.length + " slices")
    return result;
  }

  const pointsPerSubSubCloud = 1000
  const vertexSize = 0.02

  const myColor = colors[props.coloring]
  const slices = spliceArray(props.points, pointsPerSubSubCloud)

  const handlePointClick = useCallback((event) => {
    // guard against ray not hitting point
    if (event.distanceToRay > vertexSize / 2) return

    // we got a hit!
    event.stopPropagation()
    const eventArray = event.object.geometry.attributes.position.array
    const pointPosition = new THREE.Vector3(
      eventArray[event.index * 3],
      eventArray[event.index * 3 + 1],
      eventArray[event.index * 3 + 2]
    )

    props.handlePointClick(pointPosition)
  }, [props])


  return <>
    {slices.map((slice, sliceIndex) =>
      <Points key={sliceIndex} limit={pointsPerSubSubCloud} onPointerUp={e => handlePointClick(e)}>
        <pointsMaterial attach={"material"}
          map={props.texture}
          color={myColor}
          size={vertexSize}
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