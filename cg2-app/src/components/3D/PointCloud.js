// https://threejs.org/docs/#api/en/objects/Points

import { useCallback, useMemo } from "react";
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

  const handlePointClick = () => { }


  return (
    <>
      <SubPointCloud points={vanillaPoints} coloring="vanilla" texture={CircleImg} handlePointClick={handlePointClick} />
      <SubPointCloud points={selectedPoints} coloring="selected" texture={CircleImg} handlePointClick={handlePointClick} />
      <SubPointCloud points={highlightedPoints} coloring="highlighted" texture={CircleImg} handlePointClick={handlePointClick} />
    </>
  )

}

export default PointCloud