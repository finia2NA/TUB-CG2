import React, { useState, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Sidemenu from './components/UI/Sidemenu';
import Line3D from './components/3D/Line3D';
import Card from './components/UI/Card';
import { KDTreePointDataStructure as PointDataStructure } from './model/pointDataStructures'; // change import here to switch between data structures
import DataReader from './model/DataReader'; // change import here to switch between data structures
import PointCloud from './components/3D/PointCloud';

const logging = true

const App = () => {
  // used to render the point cloud
  const [dataName, setDataName] = useState("cube2");
  const [points, setPoints] = useState(new PointDataStructure());
  const [selectedPoints, setSelectedPoints] = useState([]);

  // used to render query results
  const [highlightedPoints, setHighlightedPoints] = useState([]);
  const [highlightedLines, setHighlightedLines] = useState([]);
  const [displayLines, setDisplayLines] = useState(true);

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



  useEffect(() => {
    const reader = new DataReader(dataName)
    const readData = async () => {
      // time how long this takes
      console.time("read data")
      const points = await reader.read_file(new PointDataStructure())
      points.buildTree()
      console.timeEnd("read data")

      setPoints(points);
    }
    readData()
  }, [dataName])

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
    // debugger;
    const newHighlightedPoints = [];
    const newHighlightedLines = [];
    for (const p of selectedPoints) {
      const search = gatherMethod === "knn" ? points.knnSearch.bind(points) : points.radiusSearch.bind(points);
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
        <Canvas camera={{ position: [0, 0, 2], near: 0.001 }} style={{ background: "grey" }} >


          {points.getAllPoints().length > 0 &&
            <PointCloud points={points} selectedPoints={selectedPoints} highlightedPoints={highlightedPoints} handlePointClick={handlePointClick} isSelectMode={shiftPressed} />
          }

          {/* lines */}
          {displayLines && highlightedLines.map((line, index) => (
            <Line3D key={index} start={line.start} end={line.end} />
          ))}

          {/* controls */}
          <OrbitControls />
          <Stats />

        </Canvas>

      </Card>
      <Card style={{ flex: 2 }} >
        <Sidemenu onClearSelection={onClearSelection} onPointQuery={onPointQuery} displayLines={displayLines} setDisplayLines={setDisplayLines} />
      </Card>
    </div >
  );
}

export default App;