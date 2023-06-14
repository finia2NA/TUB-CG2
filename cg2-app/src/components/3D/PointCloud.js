// https://threejs.org/docs/#api/en/objects/Points

import { useMemo } from "react";
import SubPointCloud from "./SubPointCloud";
import circleImg from "../../asset/circle.png";
import { useLoader } from "react-three-fiber";
import * as THREE from "three";
import React from 'react';

const logging = false

const PointCloud = (props) => {

  const CircleImg = useLoader(THREE.TextureLoader, circleImg);


  // Separate Points into which color they should be rendered in
  const { vanillaPoints, selectedPoints, highlightedPoints } = useMemo(() => {
    if (logging) console.log("recomputing points in point cloud")

    const points = props.points.toArray();

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
    // render each color as its own subcloud
    <>
      <SubPointCloud points={vanillaPoints} coloring="vanilla" texture={CircleImg} handlePointClick={props.handlePointClick} isSelectMode={props.isSelectMode} vertexSize={props.vertexSize} />
      <SubPointCloud points={selectedPoints} coloring="selected" texture={CircleImg} handlePointClick={props.handlePointClick} isSelectMode={props.isSelectMode} vertexSize={props.vertexSize} />
      <SubPointCloud points={highlightedPoints} coloring="highlighted" texture={CircleImg} handlePointClick={props.handlePointClick} isSelectMode={props.isSelectMode} vertexSize={props.vertexSize} />
    </>
  )

}

export default PointCloud