import { DoubleSide, Vector3 } from "three";
import * as THREE from "three";
import PointRep from "../../model/PointRep";
import Line3D from "./Line3D";
import React, { useMemo } from "react";

const exNormal = new Vector3(0, 1, 0);
const exampleData = [
  [new PointRep(new Vector3(0, 0, 0), exNormal, null, 0, 0),
  new PointRep(new Vector3(0, 0.5, 0), exNormal, null, 0, 0.5),
  new PointRep(new Vector3(0, 1, 0), exNormal, null, 0, 1)],
  [new PointRep(new Vector3(0.5, 0, 1), exNormal, null, 0.5, 0),
  new PointRep(new Vector3(0.5, 0.5, 1), exNormal, null, 0.5, 0.5),
  new PointRep(new Vector3(0.5, 1, 1), exNormal, null, 0.5, 1)],
  [new PointRep(new Vector3(1, 0, 0), exNormal, null, 1, 0),
  new PointRep(new Vector3(1, 0.5, 0), exNormal, null, 1, 0.5),
  new PointRep(new Vector3(1, 1, 0), exNormal, null, 1, 1)]
]

const Surface3D = ({ points = exampleData, wireFrameMode = false }) => {

  const geometry = useMemo(() => {
    if (!Array.isArray(points)) {
      console.error("points must be an array")
    }

    // notthing to render if there are no points
    if (points.length === 0) return;

    // check if points is a 2D array
    if (!Array.isArray(points[0])) {
      console.error("points must be a 2D array indexed by [u][v]")
      return null
    }

    const numU = points.length;
    const numV = points[0].length;

    const uvToIndex = (u, v) => {
      return u * numV + v;
    }

    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array(numU * numV * 3);
    for (let u = 0; u < numU; u++) {
      for (let v = 0; v < numV; v++) {
        const index = uvToIndex(u, v);
        vertices[index * 3] = points[u][v].position.x;
        vertices[index * 3 + 1] = points[u][v].position.y;
        vertices[index * 3 + 2] = points[u][v].position.z;
      }
    }

    const indices = [];
    for (let u = 0; u < numU - 1; u++) {
      for (let v = 0; v < numV - 1; v++) {
        indices.push(uvToIndex(u, v), uvToIndex(u + 1, v), uvToIndex(u + 1, v + 1));
        indices.push(uvToIndex(u, v), uvToIndex(u + 1, v + 1), uvToIndex(u, v + 1));
      }
    }

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    return geometry
  }, [points])

  const normalCoords = useMemo(() => {
    const normalCoords = []
    if (points.length !== 0 && points[0][0].normal) {

      for (let u = 0; u < points.length; u++) {
        for (let v = 0; v < points[0].length; v++) {
          const point = points[u][v];
          const start = point.position;
          const end = point.position.clone().add(point.normal.clone().multiplyScalar(0.1));
          normalCoords.push({ start, end })
        }
      }
    }
    return normalCoords;
  }, [points])


  if (points.length === 0) return null;


  return (
    <>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="violet" transparent opacity={0.5} side={DoubleSide} depthTest={false} wireframe={wireFrameMode} />
      </mesh>

      {normalCoords.length !== 0 && normalCoords.map((normalCoord, i) => {
        return (
          <Line3D key={i} start={normalCoord.start} end={normalCoord.end} color="red" />
        )
      }
      )}
    </>

  )
}

export default Surface3D;