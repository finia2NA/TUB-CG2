import React, { useEffect, useRef } from 'react';
import { DoubleSide, BufferGeometry, BufferAttribute, Vector3 } from "three";
import { flattenArray } from '../../util/flattenArray';
import PointRep from '../../model/PointRep';

const testData = {
  vertices: [
    [-1, -1, 1],   // 0
    [1, -1, 1],    // 1
    [1, 1, 1],     // 2
    [-1, 1, 1],    // 3
    [-1, -1, -1],  // 4
    [1, -1, -1],   // 5
    [1, 1, -1],    // 6
    [-1, 1, -1]    // 7
  ],
  faces: [
    [0, 1, 2],
    [2, 3, 0],
    [4, 5, 6],
    [6, 7, 4],
    [0, 4, 7],
    [7, 3, 0],
    [1, 5, 6],
    [6, 2, 1],
    [2, 6, 7],
    [7, 3, 2],
    [1, 0, 4],
    [4, 5, 1]
  ]

}

const unwrapVertexData = (vertexArray) => {
  if (vertexArray.length === 0) new Float32Array(0);

  if (vertexArray[0] instanceof Array) {
    return new Float32Array(flattenArray(vertexArray));
  } else if (vertexArray[0] instanceof Vector3) {
    const myArray = vertexArray.map(v => [v.x, v.y, v.z]);
    return new Float32Array(flattenArray(myArray));
  } else if (vertexArray[0] instanceof PointRep) {
    const myArray = vertexArray.map(v => [v.position.x, v.position.y, v.position.z]);
    return new Float32Array(flattenArray(myArray));
  } else {
    throw new Error("Invalid vertex data type");
  }
}

const Obj3D = (props) => {

  // const { vertices, faces } = props;
  const { vertices: vertexArray, faces: facesArray } = props;

  const ref = useRef();

  useEffect(() => {
    const geo = new BufferGeometry();

    const vertices = unwrapVertexData(vertexArray);
    const indices = flattenArray(facesArray);
    geo.setIndex(indices);
    geo.setAttribute('position', new BufferAttribute(vertices, 3));

    ref.current.geometry = geo;
  }, []);

  return (
    <mesh ref={ref}>
      <meshBasicMaterial color="violet" transparent opacity={0.5} side={DoubleSide} depthTest={false} />
    </mesh>
  );
};

export default Obj3D;


/* Example for reference from https://threejs.org/docs/#api/en/core/BufferGeometry

const geometry = new THREE.BufferGeometry(); const vertices = new Float32Array(
  [-1.0, -1.0, 1.0, // v0
    1.0, -1.0, 1.0, // v1
    1.0, 1.0, 1.0, // v2
  -1.0, 1.0, 1.0, // v3 
  ]);
const indices = [0, 1, 2, 2, 3, 0,];
geometry.setIndex(indices);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

*/