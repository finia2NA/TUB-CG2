import { DoubleSide } from "three";

const Plane3D = (props) => {
  // the position is 0 in 2 dimensions and the actual position in the axis direction
  let rotation = [0, 0, 0];
  if (props.axis === 0) { rotation[1] = Math.PI / 2 }
  else if (props.axis === 1) { rotation[0] = Math.PI / 2 }


  let position = [0, 0, 0];

  // set position on the axis
  position[props.axis] = props.position[props.axis];

  let scaling = [1, 1, 1];


  if (props.axis === 0) {
    const yScale = props.limits[1][1] - props.limits[1][0];
    const zScale = props.limits[2][1] - props.limits[2][0];
    position[1] = props.limits[1][0] + yScale / 2;
    position[2] = props.limits[2][0] + zScale / 2;
    scaling = [zScale, yScale, 1]
  }
  else if (props.axis === 1) {
    const xScale = props.limits[0][1] - props.limits[0][0];
    const zScale = props.limits[2][1] - props.limits[2][0];
    position[0] = props.limits[0][0] + xScale / 2;
    position[2] = props.limits[2][0] + zScale / 2;
    scaling = [xScale, zScale, 1]


  }
  else if (props.axis === 2) {
    const xScale = props.limits[0][1] - props.limits[0][0];
    const yScale = props.limits[1][1] - props.limits[1][0];

    position[0] = props.limits[0][0] + xScale / 2;
    position[1] = props.limits[1][0] + yScale / 2;
    scaling = [xScale, yScale, 1]
  }


  return (
    <mesh position={position} scale={scaling} 
      rotation={rotation}>
      <planeGeometry />
      <meshBasicMaterial color="black" transparent opacity={0.3} side={DoubleSide} depthTest={false} />
    </mesh>
  );
}

export default Plane3D;