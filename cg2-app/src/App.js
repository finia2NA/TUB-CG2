import React, { useState, useEffect, useCallback } from 'react';
import Sidemenu from './components/UI/Sidemenu';
import Card from './components/UI/Card';
import { KDTreePointDataStructure as PointDataStructure } from './model/pointDataStructures'; // change import here to switch between data structures
import DataReader from './model/DataReader'; // change import here to switch between data structures
import Viewport from './components/3D/Viewport';
import Surface from './model/surface';
import Implicit from './model/Implicit';

const App = () => {

  // I realize that a lot of this data could live in the UI elements and be pased to the functions
  // executing the algorithms. TODO: that when we have time

  // Model to load
  const [dataName, setDataName] = useState("cat");
  const [rotateModel, setrotateModel] = useState(false); // WIP

  // Point Storing DSs
  const [points, setPoints] = useState(new PointDataStructure());
  const [pointGrid, setPointGrid] = useState([]);


  // Display Control State
  const [dsDisplayDepth, setDsDisplayDepth] = useState(0);
  const [pointCloudVersion, setPointCloudVersion] = useState(2)
  const [displayLines, setDisplayLines] = useState(false);
  const [displayCoords, setDisplayCoords] = useState(false);
  const [vertexSize, setVertexSize] = useState(0.03);

  const [selectedPoints, setSelectedPoints] = useState([]);
  const [highlightedPoints, setHighlightedPoints] = useState([]);
  const [highlightedLines, setHighlightedLines] = useState([]);

  const [wireFrameMode, setWireframeMode] = useState(false);

  // task 2
  const [surface, setSurface] = useState(null);

  const [approximationMethod, setApproximationMethod] = useState("btps");
  const [uSubDiv, setUSubDiv] = useState(10);
  const [vSubDiv, setVSubDiv] = useState(10);
  const [subDivMultiplier, setMultiplier] = useState(3);

  const [surfacePoints, setSurfacePoints] = useState([]);

  useEffect(() => {
    setSurface(new Surface(points))
    // surface.computeSurfaceFunction()
  }, [points])


  const onComputeSurface = () => {

    const newSurfacePoints = surface.getMovingSampling(uSubDiv, vSubDiv, subDivMultiplier, approximationMethod)

    setSurfacePoints(newSurfacePoints);
  }

  const onComputeImplicitSurface = () => {
    if (!points.hasNormals()) return;

    const implicit = new Implicit(points);
    implicit.calculateOffsetPoints();
    return
    implicit.calculateGrid();
    setPointGrid(implicit.pointGrid);




    // ... (add further logic to calculate grid a)
    // const isf = implicit.calculateSurface();
    // setImplicitSurface(isf)
  };

  const onClearSelection = () => {
    setSelectedPoints([]);
    setHighlightedPoints([]);
    setHighlightedLines([]);
  }

  // Load model on mount
  useEffect(() => {
    const reader = new DataReader(dataName, rotateModel)
    const readData = async () => {
      const lpoints = await reader.read_file(new PointDataStructure());
      lpoints.buildTree();
      setPoints(lpoints);


      const implicit = new Implicit(lpoints);
      implicit.calculateOffsetPoints();
    }

    readData()
    document.title = 'CG2-Tool: ' + dataName.toUpperCase();


    // TODO: onComputeImplicitSurface should be added to dep. array, but it causes an infinite loop
  }, [dataName, rotateModel])

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
        <Viewport points={points} vertexSize={vertexSize} displayLines={displayLines} displayCoords={displayCoords} dsDisplayDepth={dsDisplayDepth} selectedPoints={selectedPoints} setSelectedPoints={setSelectedPoints} highlightedPoints={highlightedPoints} highlightedLines={highlightedLines} pointCloudVersion={pointCloudVersion} surfacePoints={surfacePoints} wireFrameMode={wireFrameMode} grid={pointGrid} />
      </Card>

      {/* side menu */}
      <Card style={{ flex: 2 }} >
        <Sidemenu onClearSelection={onClearSelection} onPointQuery={onPointQuery} displayLines={displayLines} setDisplayLines={setDisplayLines} dsDisplayDepth={dsDisplayDepth} setDsDisplayDepth={setDsDisplayDepth} displayCoords={displayCoords} setDisplayCoords={setDisplayCoords} vertexSize={vertexSize} setVertexSize={setVertexSize} pointCloudVersion={pointCloudVersion} setPointCloudVersion={setPointCloudVersion} uSubDiv={uSubDiv} setUSubDiv={setUSubDiv} vSubDiv={vSubDiv} setVSubDiv={setVSubDiv} multiplier={subDivMultiplier} setMultiplier={setMultiplier} onComputeSurface={onComputeSurface} approximationMethod={approximationMethod} setApproximationMethod={setApproximationMethod} wireFrameMode={wireFrameMode} setWireFrameMode={setWireframeMode} dataName={dataName} setDataName={setDataName} />
      </Card>

    </div >
  );
}

export default App;