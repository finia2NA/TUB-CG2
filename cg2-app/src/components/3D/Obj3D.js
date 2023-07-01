import React, { useEffect, useRef } from 'react';
import { DoubleSide, BufferGeometry, BufferAttribute } from "three";
import { flattenArray } from '../../util/flattenArray';

const testData = {
  vertexArray: [
    [-1, -1, 1],   // 0
    [1, -1, 1],    // 1
    [1, 1, 1],     // 2
    [-1, 1, 1],    // 3
    [-1, -1, -1],  // 4
    [1, -1, -1],   // 5
    [1, 1, -1],    // 6
    [-1, 1, -1]    // 7
  ],
  facesArray: [
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

const Obj3D = (props) => {

  // const { vertices, faces } = props;
  const {vertexArray, facesArray } = testData;

  const ref = useRef();

  useEffect(() => {
    const geo = new BufferGeometry();

    const vertices = new Float32Array(flattenArray(vertexArray));
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