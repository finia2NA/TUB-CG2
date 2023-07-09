import React, { useState, useEffect } from 'react';
import Sidemenu from './components/UI/Sidemenu';
import Card from './components/UI/Card';
import { KDTreePointDataStructure as PointDataStructure } from './model/pointDataStructures'; // change import here to switch between data structures
import DataReader from './model/DataReader'; // change import here to switch between data structures
import Viewport from './components/3D/Viewport';
import Surface from './model/surface';
import Implicit from './model/Implicit';
import { AppContext } from './context/AppContext';
import { computeNormals, graphLaplacian, laplaceSmooth, cotanSmooth, cotanSmoothImplicit, eigenSmooth } from './model/Smoothing';

const App = () => {
  const {
    dataName,
    rotateModel,
    approximationMethod,
    uSubDiv,
    vSubDiv,
    subDivMultiplier,
    setHasNormals,
    smoothingMethod,
    smoothingSteps,
    smoothingLambda,
    smoothingEigenPercentage
  } = React.useContext(AppContext);

  // Point Storing DSs
  const [points, setPoints] = useState(new PointDataStructure());
  const [pointGrid, setPointGrid] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [highlightedPoints, setHighlightedPoints] = useState([]);


  const [highlightedLines, setHighlightedLines] = useState([]);

  // task 2
  const [surface, setSurface] = useState(null);
  const [surfacePoints, setSurfacePoints] = useState([]);
  const [surfacePointsMC, setSurfacePointsMC] = useState(null);

  useEffect(() => {
    setSurface(new Surface(points))
    // surface.computeSurfaceFunction()
  }, [points])

  const onComputeSurface = () => {
    const newSurfacePoints = surface.getMovingSampling(uSubDiv, vSubDiv, subDivMultiplier, approximationMethod)
    setSurfacePoints(newSurfacePoints);
  }

  const onSmooth = () => {

    // select smoothing function
    let newPoints = points.copy();

    switch (smoothingMethod) {
      case "laplace":
        newPoints = laplaceSmooth(newPoints, smoothingLambda, smoothingSteps)
        break;
      case "cotan-laplace":
        newPoints = cotanSmooth(newPoints, smoothingLambda, smoothingSteps)
        break;
      case "cotan-laplace-implicit":
        newPoints = cotanSmoothImplicit(newPoints, smoothingLambda, smoothingSteps)
        break;
      case "cotan-eigen":
        newPoints = eigenSmooth(newPoints, smoothingEigenPercentage)
        break;
      default:
        throw new Error("Invalid smoothing method");
    }
    
    setPoints(newPoints);
  }


  const onClearSelection = () => {
    setSelectedPoints([]);
    setHighlightedPoints([]);
    setHighlightedLines([]);
  }

  // Load model on mount
  useEffect(() => {
    const reader = new DataReader(dataName, rotateModel)
    const readData = async () => {
      const readPoints = await reader.read_file(new PointDataStructure());
      readPoints.buildTree();
      if (readPoints.isOBJ) computeNormals(readPoints);
      setHasNormals(readPoints.hasNormals());
      setPoints(readPoints);
    }

    readData()
    document.title = 'CG2-Tool: ' + dataName.toUpperCase();


  }, [dataName, rotateModel, setHasNormals])

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

  const onComputeImplicit = async (nx, ny, nz, degree, wendlandRadius, alpha) => {
    console.log("compute implicit")
    const compute = async () => {
      const implicit = new Implicit(points, degree, wendlandRadius, alpha);
      const grid = await implicit.calculateGridValues(nx, ny, nz);
      setPointGrid(grid)
      setSurfacePointsMC(implicit.marchingCubes())
    }
    compute()
  }

  return (
    < div style={{ display: "flex", flexDirection: "row", padding: "16px", height: "80vh" }
    }>
      <Card style={{ flex: 5 }}>
        <Viewport points={points} selectedPoints={selectedPoints} setSelectedPoints={setSelectedPoints} highlightedPoints={highlightedPoints} highlightedLines={highlightedLines} surfacePoints={surfacePoints} surfacePointsMC={surfacePointsMC} grid={pointGrid} />
      </Card>

      {/* side menu */}
      <Card style={{ flex: 2 }} >
        <Sidemenu onClearSelection={onClearSelection} onPointQuery={onPointQuery} onComputeSurface={onComputeSurface} onComputeImplicit={onComputeImplicit} onSmooth={onSmooth} />
      </Card>

    </div >
  );
}

export default App;