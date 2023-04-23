// This is a component that renders a three-dimensional point cloud. The point cloud is rendered using react-three-fiber and three.js. The points are rendered as spheres, and the position of the spheres is given by the representation prop. The point is highlighted when the representation is in the highlightedPoints array, and is selected when the representation is in the selectedPoints array.

// The component takes care of the rendering and the user interaction, while the point data is stored in the pointRepresentations state variable. The pointRepresentations state variable is updated using the useEffect hook, which generates a random point cloud once when the component is rendered.

// The handlePointClick function is passed to the Point3D component, and is called when a point is clicked. The handlePointClick function adds or removes the point representation from the selectedPoints array.

import React, { useState, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import Sidemenu from './components/UI/Sidemenu';
import PointRep from './model/PointRep';
import Point3D from './components/3D/Point3D';
import Card from './components/UI/Card';
import { LinearPointDataStructure as PointDataStructure } from './model/pointDataStructures'; // change import here to switch between data structures
import Cuboid3D from './components/3D/Cuboid3D';
import Plane3D from './components/3D/Plane3D';

const App = () => {

  const [pointRepresentations, setPointRepresentations] = useState(new PointDataStructure());
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [highlightedPoints, setHighlightedPoints] = useState([]);


  const [planes, setPlanes] = useState([]);
  const [cubes, setCubes] = useState([]);
  const [dsRenderMode, setDsRenderMode] = useState(0) // controls which data structure is rendered. 0 = none, 1 = planes, 2 = cubes

  const handlePointClick = (thePoint) => {
    if (selectedPoints.includes(thePoint)) {
      // if the point is already selected, remove it from the list
      setSelectedPoints(selectedPoints.filter(point => point !== thePoint));
    } else {
      // otherwise, add it to the list
      setSelectedPoints([...selectedPoints, thePoint]);
    }
  }

  // generate random points
  useEffect(() => {
    let points = new PointDataStructure();
    for (let i = 0; i < 200; i++) {
      points.addPoint(new PointRep([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]));
    }
    setPointRepresentations(points);
  }, []);



  // function that is called when the user clicks the "Gather" button
  const onPointQuery = (gatherMethod = "knn", gatherParameter = 10) => {
    const newHighlightedPoints = [];
    for (const p of selectedPoints) {
      if (gatherMethod === "knn") {
        const targets = pointRepresentations.knnSearch(p, gatherParameter)
        newHighlightedPoints.push(...targets);
      }
      if (gatherMethod === "radius") {
        const targets = pointRepresentations.radiusSearch(p, gatherParameter)
        newHighlightedPoints.push(...targets);
      }

    }
    setHighlightedPoints(newHighlightedPoints);
  }


  // Renders the 3D point cloud
  // Also renders the orbit controls, which allows for the user to rotate the camera using the mouse
  // The camera is set to a position that is 2 units away from the origin (0, 0, 2)
  // The canvas is grey
  return (
    <div style={{ display: "flex", flexDirection: "row", padding: "16px", height: "80vh" }}>
      <Card style={{ flex: 5 }}>
        <Canvas camera={{ position: [0, 0, 2] }} style={{ background: "grey" }} >
          <ambientLight />

          {/* point cloud */}
          {pointRepresentations.getAllPoints().map((point, index) => (
            <Point3D key={index} representation={point} selected={selectedPoints.includes(point)} onClick={handlePointClick} highlighted={highlightedPoints.includes(point)} />
          ))}

          {/* data structures TEST */}
          <Cuboid3D representation={{ position: [-0.5, -0.3, 0.2], dimensions: [0.2, 0.7, 0.3] }} />
          <Plane3D representation={{ axis: 2, point: [0, 0, 0] }} />

          {/* controls */}
          <OrbitControls />
        </Canvas>

      </Card>
      <Card style={{ flex: 2 }} >
        <Sidemenu onClearSelection={() => setSelectedPoints([])} onPointQuery={onPointQuery} />
      </Card>
    </div>
  );
}

export default App;