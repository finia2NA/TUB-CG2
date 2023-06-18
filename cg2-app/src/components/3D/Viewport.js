import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
import Line3D from "./Line3D";
import KDVisualizer from './kdVisualizer';
import CoordSystem from './CoordSystem';
import PointCloud2 from './PointCloud2';
import PointCloud from './PointCloud';
import { OrbitControls } from "@react-three/drei";
import Plane3D from "./Plane3D";
import Surface3D from "./Surface3D";
import Normals3D from "./Normals3D";
import { Vector3 } from "three";
import ValueBasedPoints from "./ValueBasedPoints";
import PointRep from "../../model/PointRep";

const logging = true

const Viewport = ({ points, vertexSize, displayLines, displayCoords, dsDisplayDepth, selectedPoints, setSelectedPoints, highlightedPoints, highlightedLines, pointCloudVersion, surfacePoints, wireFrameMode }) => {

  // Keyboard State
  const [shiftPressed, setShiftPressed] = useState(false);
  onkeydown = (e) => {
    if (e.key === "Shift") {
      setShiftPressed(true);
    }
  }
  onkeyup = (e) => {
    if (e.key === "Shift") {
      setShiftPressed(false);
    }
  }

  // Function that is called when point is clicked 
  const handlePointClick = (position) => {
    const matchingPoints = points.toArray().filter(p => p.distanceToPosition(position) < 0.0001)

    if (logging) {
      console.log("clicked point at " + position.x + ", " + position.y + ", " + position.z)
      console.log("matched to:", matchingPoints)
    }


    if (matchingPoints.length === 0) {
      console.error("no matching points found")
    }

    if (selectedPoints.includes(matchingPoints[0])) {
      setSelectedPoints(selectedPoints.filter(p => p !== matchingPoints[0]))
    } else {
      setSelectedPoints([...selectedPoints, matchingPoints[0]])
    }

  }

  const exampleFunctionPoints = () => {
    const points = []
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const curr = new PointRep(new Vector3(i, j, 0))
        curr.functionValue = (i + j - 10) / 10
        points.push(curr)
      }
    }
    return points
  }




  return (
    <Canvas
      camera={{ position: [0, 0, 2], near: 0.01, far: 10000 }}
      style={{ background: "grey" }}
      id='canvas'>

      {/* points */}
      {pointCloudVersion === 1 && points.toArray().length > 0 &&
        <PointCloud points={points} selectedPoints={selectedPoints} highlightedPoints={highlightedPoints} handlePointClick={handlePointClick} isSelectMode={shiftPressed} vertexSize={vertexSize*20} />
      }
      {pointCloudVersion === 2 && points.toArray().length > 0 &&
        // <SubPointCloud2 points={points} coloring="highlighted" vertexSize={vertexSize} />
        <PointCloud2 points={points} selectedPoints={selectedPoints} highlightedPoints={highlightedPoints} handlePointClick={handlePointClick} isSelectMode={shiftPressed} vertexSize={vertexSize*20} />

      }

      {points.hasNormals() && <Normals3D points={points.points} />}

      {/* Lines */}
      {displayLines && highlightedLines.map((line, index) => (
        <Line3D key={index} start={line.start} end={line.end} />
      ))}

      {/* DataStructure */}
      <KDVisualizer points={points} displayDepth={dsDisplayDepth} vertexSize={vertexSize} />

      {/* Coordinate system */}
      {displayCoords && <CoordSystem size={10} />}

      <Surface3D
        points={surfacePoints} wireFrameMode={wireFrameMode}
      />

      {/* <ValueBasedPoints points={exampleFunctionPoints()} /> */}

      {/* Controls */}
      <OrbitControls />
      {/* <Stats /> */}

    </Canvas>
  )
}

export default Viewport;