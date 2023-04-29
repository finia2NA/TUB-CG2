// https://threejs.org/docs/#api/en/objects/Points

import { Suspense, useCallback, useMemo } from "react"
import * as THREE from "three";

import circleImg from "../../asset/circle.png";
import { useLoader } from "react-three-fiber";
import SubCloud from "./SubPointCloud";


const PointCloud = (props) => {

  const points = props.points.getAllPoints()

  const normal = useMemo(() => {
    return props.points.getAllPoints().filter(point => !props.selectedPoints.includes(point) && !props.highlightedPoints.includes(point))
  }, [props.points, props.selectedPoints, props.highlightedPoints])

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
        <SubCloud points={
          props.points.getAllPoints().filter(p => ![...props.selectedPoints, ...props.highlightedPoints].includes(p))}
          color={"blue"} handlePointClick={handlePointClick} />
      }
      {props.selectedPoints.length > 0 &&
        <SubCloud points={props.selectedPoints} color={"red"} handlePointClick={handlePointClick} logging />
      }
      {props.highlightedPoints.length > 0 &&
        <SubCloud points={props.highlightedPoints} color={"green"} handlePointClick={handlePointClick} />
      }
    </>
  )

}

export default PointCloud