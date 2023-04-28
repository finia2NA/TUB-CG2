// https://threejs.org/docs/#api/en/objects/Points

import { Suspense, useCallback, useMemo } from "react"
import * as THREE from "three";

import circleImg from "../../asset/circle.png";
import { useLoader } from "react-three-fiber";

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
  }, [])

  return (
    <points onClick={onClick}>
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
        color={props.color}
        size={vertexSize}
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );

}


const PointCloud = (props) => {

  const points = props.points.getAllPoints()

  // replace with actual highlightable once that works again
  const highlighted = props.highlightedPoints
  const selected = props.selectedPoints
  const normal = props.points.getAllPoints().filter(point => !selected.includes(point) && !highlighted.includes(point))

  const handlePointClick = (vector) => {

    console.log(vector.x, vector.y, vector.z)

    // TODO: why does the closest point return exactly the one I want, but filtering from the array returns nothing???
    const closestPoint = points.reduce((prev, curr) => {
      const prevDistance = Math.sqrt(Math.pow(prev.position[0] - vector.x, 2) + Math.pow(prev.position[1] - vector.y, 2) + Math.pow(prev.position[2] - vector.z, 2))
      const currDistance = Math.sqrt(Math.pow(curr.position[0] - vector.x, 2) + Math.pow(curr.position[1] - vector.y, 2) + Math.pow(curr.position[2] - vector.z, 2))
      return prevDistance < currDistance ? prev : curr
    })

    props.handlePointClick(closestPoint)
  }

  return (
    <>
      {normal.length > 0 &&
        <SubCloud points={normal} color={"blue"} handlePointClick={handlePointClick} />
      }
      {selected.length > 0 &&
        <SubCloud points={selected} color={"red"} handlePointClick={handlePointClick} />
      }
      {highlighted.length > 0 &&
        <SubCloud points={highlighted} color={"green"} handlePointClick={handlePointClick} />
      }
    </>
  )

}

export default PointCloud