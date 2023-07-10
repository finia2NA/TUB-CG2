import React from "react";
import { Vector3, BufferGeometry, BufferAttribute } from "three";
import { Mesh } from "three";
import { AppContext } from "../../context/AppContext";

const Mesh3D = (props) => {

  const {
    wireFrameMode
  } = React.useContext(AppContext)

  const points = props.obj.points;
  const faces = props.obj.faces;

  const geometry = new BufferGeometry();
  const vertices = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    const position = points[i].position;
    vertices[i * 3] = position.x;
    vertices[i * 3 + 1] = position.y;
    vertices[i * 3 + 2] = position.z;
  }

  const indices = [];
  for (let i = 0; i < faces.length; i++) {
    if (faces[i].length > 3) console.log("face is not a triangle");
    const face = faces[i];
    indices.push(...face.indices);
  }

  geometry.setAttribute("position", new BufferAttribute(vertices, 3));
  geometry.setIndex(indices);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={0x00ff00} wireframe={wireFrameMode} />
    </mesh>
  )


}

export default Mesh3D;