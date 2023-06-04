import React, { useState, useEffect } from 'react';
import Sidemenu from './components/UI/Sidemenu';
import Card from './components/UI/Card';
import { KDTreePointDataStructure as PointDataStructure } from './model/pointDataStructures'; // change import here to switch between data structures
import {NormalDataReader} from './model/DataReader'; // change import here to switch between data structures
import Viewport from './components/3D/Viewport';

const App = () => {

  // Model to load
  const [dataName, setDataName] = useState("cat");

  // Point Storing DSs
  const [points, setPoints] = useState(new PointDataStructure());
  // const [state, setState] = useState({
  //   points: new PointDataStructure(),
  //   normals: new PointDataStructure()
  // });

  // Display Control State
  const [dsDisplayDepth, setDsDisplayDepth] = useState(0);
  const [pointCloudVersion, setPointCloudVersion] = useState(2)
  const [displayLines, setDisplayLines] = useState(false);
  const [displayCoords, setDisplayCoords] = useState(false);
  const [vertexSize, setVertexSize] = useState(0.5);

  const [selectedPoints, setSelectedPoints] = useState([]);
  const [highlightedPoints, setHighlightedPoints] = useState([]);
  const [highlightedLines, setHighlightedLines] = useState([]);

  const onClearSelection = () => {
    setSelectedPoints([]);
    setHighlightedPoints([]);
    setHighlightedLines([]);
  }

  // const updatePoints = (newPoints) => {
  //   setState(prevState => ({
  //     ...prevState,
  //     points: newPoints
  //   }));
  // };
  // const updateNormals = (newNormals) => {
  //   setState(prevState => ({
  //     ...prevState,
  //     normals: newNormals
  //   }));
  // };

  // Load model on mount
  useEffect(() => {
    const reader = new NormalDataReader(dataName)
    const readData = async () => {
      const points = await reader.read_file(new PointDataStructure())
<<<<<<< Updated upstream
      points.buildTree()
      console.log(points)
=======
      // console.log(typeof(data))
      // const points = data[0];
      // const normals = data[1]
      // points.buildTree();
>>>>>>> Stashed changes

      // updatePoints(points);
      // updateNormals(normals);
      setPoints(points);
      console.log(Object.keys(points.normals).length)
      console.log(points.points.length)
    }
    console.time("read data")
    readData()
    console.timeEnd("read data")
    document.title = 'CG2-Tool: ' + dataName.toUpperCase();

  }, [dataName])

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
        <Viewport points={points} vertexSize={vertexSize} displayLines={displayLines} displayCoords={displayCoords} dsDisplayDepth={dsDisplayDepth} selectedPoints={selectedPoints} setSelectedPoints={setSelectedPoints} highlightedPoints={highlightedPoints} highlightedLines={highlightedLines} pointCloudVersion={pointCloudVersion} />
      </Card>

      {/* side menu */}
      <Card style={{ flex: 2 }} >
        <Sidemenu onClearSelection={onClearSelection} onPointQuery={onPointQuery} displayLines={displayLines} setDisplayLines={setDisplayLines} dsDisplayDepth={dsDisplayDepth} setDsDisplayDepth={setDsDisplayDepth} displayCoords={displayCoords} setDisplayCoords={setDisplayCoords} vertexSize={vertexSize} setVertexSize={setVertexSize} pointCloudVersion={pointCloudVersion} setPointCloudVersion={setPointCloudVersion} />
      </Card>

    </div >
  );
}

export default App;