import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import Sidemenu from './components/UI/Sidemenu';
import PointRep from './model/PointM';
import Point3D from './components/3D/Point3D';
import Card from './components/UI/Card';

const App = () => {

  const [pointRepresentations, setPointRepresentations] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [highlightedPoints, setHighlightedPoints] = useState([]);

  const handlePointClick = (thePoint) => {
    if (selectedPoints.includes(thePoint)) {
      setSelectedPoints(selectedPoints.filter(point => point !== thePoint));
    } else { setSelectedPoints([...selectedPoints, thePoint]); }
  }

  // generate random points
  useEffect(() => {
    let points = [];
    for (let i = 0; i < 100; i++) {
      points.push(new PointRep(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5));
    }
    setPointRepresentations(points);
  }, []);


  return (
    <div style={{ display: "flex", flexDirection: "row", padding: "16px", height: "80vh" }}>
      <Card style={{ flex: 5 }}>
        <Canvas camera={{ position: [0, 0, 2] }} style={{ background: "grey" }} >
          <ambientLight />

          {/* point cloud */}
          {pointRepresentations.map((point, index) => (
            <Point3D key={index} representation={point} selected={selectedPoints.includes(point)} onClick={handlePointClick} />
          ))}

          {/* controls */}
          <OrbitControls />
        </Canvas>
      </Card>
      <Card style={{ flex: 2 }}>
        <Sidemenu />
      </Card>
    </div>
  );
}

export default App;