import { DoubleSide, Vector3 } from "three";
import * as THREE from "three";
import { SampledPointRep } from "../../model/PointRep";
<<<<<<< Updated upstream
=======
import React, { useMemo } from "react";
import Line3D from "./Line3D";
>>>>>>> Stashed changes

const exampleData = [
  [new SampledPointRep(new Vector3(0, 0, 0), 0, 0),
  new SampledPointRep(new Vector3(0, 0.5, 0), 0, 0.5),
  new SampledPointRep(new Vector3(0, 1, 0), 0, 1)],
  [new SampledPointRep(new Vector3(0.5, 0, 1), 0.5, 0),
  new SampledPointRep(new Vector3(0.5, 0.5, 1), 0.5, 0.5),
  new SampledPointRep(new Vector3(0.5, 1, 1), 0.5, 1)],
  [new SampledPointRep(new Vector3(1, 0, 0), 1, 0),
  new SampledPointRep(new Vector3(1, 0.5, 0), 1, 0.5),
  new SampledPointRep(new Vector3(1, 1, 0), 1, 1)]
]

const Surface3D = ({ points = exampleData }) => {
  // check if points is a 2D array
  if (!Array.isArray(points) || !Array.isArray(points[0])) {
    console.error("points must be a 2D array indexed by [u][v]")
    return null
  }

  // TODO: useMemo like all of this
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

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color="violet" transparent opacity={0.5} side={DoubleSide} depthTest={false} />
    </mesh>
  )
}

export default Surface3D;