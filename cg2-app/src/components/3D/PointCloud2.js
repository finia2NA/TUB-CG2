// https://threejs.org/docs/#api/en/objects/Points

import React, { useMemo } from "react";
import SubPointCloud2 from "./SubPointCloud2";

const PointCloud2 = (props) => {

  // Separate Points into which color they should be rendered in
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
    // render each color as its own subcloud
    <>
      <SubPointCloud2 points={vanillaPoints} coloring="vanilla" handlePointClick={props.handlePointClick} vertexSize={props.vertexSize} />
      <SubPointCloud2 points={selectedPoints} coloring="selected" handlePointClick={props.handlePointClick} vertexSize={props.vertexSize} />
      <SubPointCloud2 points={highlightedPoints} coloring="highlighted" handlePointClick={props.handlePointClick} vertexSize={props.vertexSize} />
    </>
  )

}

export default PointCloud2