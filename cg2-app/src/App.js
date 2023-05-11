import React, { useState, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Sidemenu from './components/UI/Sidemenu';
import Line3D from './components/3D/Line3D';
import Card from './components/UI/Card';
import { KDTreePointDataStructure as PointDataStructure } from './model/pointDataStructures'; // change import here to switch between data structures
import DataReader from './model/DataReader'; // change import here to switch between data structures
import KDVisualizer from './components/3D/kdVisualizer';
import CoordSystem from './components/3D/CoordSystem';
import PointCloud2 from './components/3D/PointCloud2';

const logging = true
const useOldPointCloud = false

const App = () => {

  const canvasRef = React.useRef(null);

  // STATE

  // Model to load
  const [dataName, setDataName] = useState("dragon");

  // Point Storing DSs
  const [points, setPoints] = useState(new PointDataStructure());
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [highlightedPoints, setHighlightedPoints] = useState([]);

  // Display Control State
  const [highlightedLines, setHighlightedLines] = useState([]);
  const [dsDisplayDepth, setDsDisplayDepth] = useState(0);
  const [displayLines, setDisplayLines] = useState(false);
  const [displayCoords, setDisplayCoords] = useState(false);
  const [vertexSize, setVertexSize] = useState(0.5);

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


  // Load model on mount
  useEffect(() => {
    const reader = new DataReader(dataName)
    const readData = async () => {
      const points = await reader.read_file(new PointDataStructure())
      points.buildTree()

      setPoints(points);
    }
    console.time("read data")
    readData()
    console.timeEnd("read data")

  }, [dataName])

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

  const onClearSelection = () => {
    setSelectedPoints([]);
    setHighlightedPoints([]);
    setHighlightedLines([]);
  }

  // function that is called when the user clicks the "Gather" button
  const onPointQuery = (gatherMethod = "knn", gatherParameter = 10) => {
    const newHighlightedPoints = [];
    const newHighlightedLines = [];

    const search = gatherMethod === "knn" ?
      points.knnSearch.bind(points) :
      points.radiusSearch.bind(points);

    for (const p of selectedPoints) {
      const targets = search(p, gatherParameter)
      newHighlightedPoints.push(...targets);
      newHighlightedLines.push(...targets.map(target => ({ start: p.position, end: target.position })));
    }
    setHighlightedPoints(newHighlightedPoints);
    setHighlightedLines(newHighlightedLines);
  }


  return (
    < div style={{ display: "flex", flexDirection: "row", padding: "16px", height: "80vh" }
    }>
      <Card style={{ flex: 5 }}>
        <Canvas
          camera={{ position: [0, 0, 2], near: 0.001 }}
          style={{ background: "grey" }}
          ref={canvasRef}
          id='canvas'>

          {/* points */}
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

      </Card>

      {/* side menu */}
      <Card style={{ flex: 2 }} >
        <Sidemenu onClearSelection={onClearSelection} onPointQuery={onPointQuery} displayLines={displayLines} setDisplayLines={setDisplayLines} dsDisplayDepth={dsDisplayDepth} setDsDisplayDepth={setDsDisplayDepth} displayCoords={displayCoords} setDisplayCoords={setDisplayCoords} vertexSize={vertexSize} setVertexSize={setVertexSize} />
      </Card>

    </div >
  );
}

export default App;