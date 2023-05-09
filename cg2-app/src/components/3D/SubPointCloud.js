import { useCallback, useMemo } from "react";
import * as THREE from "three";

import { Point, Points } from "@react-three/drei";
import colors from "./Colors";

const logging = true

const SubPointCloud = props => {



  const pointsPerSubSubCloud = 5000
  // const vertexSize = 0.005
  const vertexSize = props.vertexSize ? props.vertexSize : 0.01


  const myColor = colors[props.coloring]

  const slices = useMemo(() => {
    // the <Points/> tag can only handle a limited number of points, so we need to split the point cloud into smaller sub clouds
    // this function splits the array into smaller arrays
    const sliceArray = (arr, maxSliceLength = 100) => {
      const result = [];
      for (let i = 0; i < arr.length; i += maxSliceLength) {
        result.push(arr.slice(i, i + maxSliceLength));
      }
      if (logging) console.log(props.coloring + ": using " + result.length + " slices")
      return result;
    }
    return sliceArray(props.points, pointsPerSubSubCloud)

  }, [props.points, props.coloring])

  const handlePointClick = useCallback((event) => {

    if (!props.isSelectMode) {
      console.log("not in select mode")
      event.stopPropagation()
    }

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
  }, [props, vertexSize])


  return <>
    {slices.map((slice, sliceIndex) =>
      <Points key={sliceIndex} limit={pointsPerSubSubCloud} onPointerDown={e => handlePointClick(e)}>
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