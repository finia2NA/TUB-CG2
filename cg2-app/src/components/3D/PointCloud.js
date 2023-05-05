// https://threejs.org/docs/#api/en/objects/Points

import { useMemo } from "react";
import SubPointCloud from "./SubPointCloud";
import circleImg from "../../asset/circle.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";



const PointCloud = (props) => {

  const CircleImg = useLoader(THREE.TextureLoader, circleImg);


  const { vanillaPoints, selectedPoints, highlightedPoints } = useMemo(() => {
    console.log("recomputing points in point cloud")

    const points = props.points.getAllPoints();

    const vanillaPoints = [];
    const selectedPoints = [];
    const highlightedPoints = [];
    for (const p of points) {
      if (props.selectedPoints.includes(p)) {
        selectedPoints.push(p);
      } else if (props.highlightedPoints.includes(p)) {
        highlightedPoints.push(p);
      } else {
        vanillaPoints.push(p);
      }
    }
    return { vanillaPoints, selectedPoints, highlightedPoints };
  }, [props.points, props.selectedPoints, props.highlightedPoints]);



  return (
    <>
      <SubPointCloud points={vanillaPoints} coloring="vanilla" texture={CircleImg} />
    </>
  )

}

export default PointCloud