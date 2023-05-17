import { useState } from "react";
import { Canvas } from "react-three-fiber";
import Line3D from "./3D/Line3D";
import KDVisualizer from './3D/kdVisualizer';
import CoordSystem from './3D/CoordSystem';
import PointCloud2 from './3D/PointCloud2';
import PointCloud from './3D/PointCloud';
import { OrbitControls } from "@react-three/drei";

const logging = true
const useOldPointCloud = true

const Viewport = ({ points, vertexSize, displayLines, displayCoords, dsDisplayDepth, selectedPoints, setSelectedPoints, highlightedPoints, highlightedLines }) => {

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
    const matchingPoints = points.getAllPoints().filter(p => p.distanceToPosition(position) < 0.0001)

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


  return (
    <Canvas
      camera={{ position: [0, 0, 2], near: 0.001 }}
      style={{ background: "grey" }}
      id='canvas'>

      {/* points */}

      {useOldPointCloud && points.getAllPoints().length > 0 &&
        <PointCloud points={points} selectedPoints={selectedPoints} highlightedPoints={highlightedPoints} handlePointClick={handlePointClick} isSelectMode={shiftPressed} vertexSize={vertexSize} />
      }

      {!useOldPointCloud && points.getAllPoints().length > 0 &&
        // <SubPointCloud2 points={points} coloring="highlighted" vertexSize={vertexSize} />
        <PointCloud2 points={points} selectedPoints={selectedPoints} highlightedPoints={highlightedPoints} handlePointClick={handlePointClick} isSelectMode={shiftPressed} vertexSize={vertexSize} />

      }

      {/* lines */}
      {displayLines && highlightedLines.map((line, index) => (
        <Line3D key={index} start={line.start} end={line.end} />
      ))}

      {/* Visualizing DataStructure */}
      <KDVisualizer points={points} displayDepth={dsDisplayDepth} vertexSize={vertexSize} />

      {displayCoords && <CoordSystem size={10} />}

      {/* controls */}
      <OrbitControls />
      {/* <Stats /> */}

    </Canvas>
  )
}

export default Viewport;