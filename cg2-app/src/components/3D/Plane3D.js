import { useRef } from "react";
import { DoubleSide } from "three";

const Plane3D = (props) => {
  const ref = useRef();

  // the position is 0 in 2 dimensions and the actual position in the axis direction
  let rotation = [0, 0, 0];
  rotation[props.axis] = Math.PI / 2;
  // let position = [0, 0, 0];
  // position[props.axis] = props.position[props.axis];
  // TODO: change this back to the above when issue of kdTree is fixed 
  const position = props.position;

  return (
    <mesh position={position} scale={[1, 1, 1]}
      rotation={rotation}>
      <planeGeometry />
      <meshBasicMaterial color="black" transparent opacity={0.3} side={DoubleSide} />
    </mesh>
  );
}

export default Plane3D;