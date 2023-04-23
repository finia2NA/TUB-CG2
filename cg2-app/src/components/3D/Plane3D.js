import { useRef } from "react";
import { DoubleSide } from "three";

const Plane3D = (props) => {
  const ref = useRef();

  // the position is 0 in 2 dimensions and the actual position in the axis direction
  let rotation = [0, 0, 0];
  rotation[props.representation.axis] = Math.PI / 2;

  //   <mesh
  //   {...props}
  //   ref={ref}
  //   position={[...position]}
  // >
  //   <planeBufferGeometry args={[1, 1]} />
  //   <meshBasicMaterial color="green" side={DoubleSide} />
  // </mesh>

  return (
    <mesh position={[0, 0, 0]} scale={[1, 1, 1]}
      rotation={rotation}>
      {/*
        The thing that gives the mesh its shape
        In this case the shape is a flat plane
      */}
      <planeBufferGeometry />
      {/*
        The material gives a mesh its texture or look.
        In this case, it is just a uniform green
      */}
      <meshBasicMaterial color="black" transparent opacity={0.3} side={DoubleSide} />
    </mesh>
  );
}

export default Plane3D;