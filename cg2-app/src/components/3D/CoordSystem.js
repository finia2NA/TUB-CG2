import { Text } from "@react-three/drei";
import { Vector3 } from "three";
import Line3D from "./Line3D";


const CoordLine = ({ axis, len }) => {
  const start = [0, 0, 0];
  start[axis] = -len / 2;

  const end = [0, 0, 0];
  end[axis] = len / 2;

  const startVector = new Vector3(...start)
  const endVector = new Vector3(...end)

  const myColor = (["red", "green", "blue"])[axis]

  return (
    // <line>
    //   <bufferGeometry attach="geometry" setFromPoints={[startVector, endVector]} />
    //   <lineBasicMaterial attach="material" color="white" />
    // </line>
    <Line3D start={startVector} end={endVector} color={myColor} />
  )
};

export default function CoordSystem({ size }) {

  const axis = [0, 1, 2];
  const datapoints = []

  for (let i = 0; i < 3; i++) {
    for (const sign of [-1, +1]) {
      const plusminus = sign === -1 ? "-" : "+";
      const label = plusminus + (i === 0 ? "X" : i === 1 ? "Y" : "Z");
      const position = [0, 0, 0];
      position[i] = sign * (size / 2 + 1)
      datapoints.push([position, label])
    }
  }

  return (
    <group>
      {datapoints.map((datapoint, i) => (
        <Text
          key={i}
          color="white" // default
          anchorX="center" // default
          anchorY="middle" // default
          position={datapoint[0]}
          scale={[2, 2, 2]}
        >{datapoint[1]}</Text>
      ))}



      {axis.map((ax) => (
        <CoordLine key={ax} axis={ax} len={size} />
      ))}
    </group>
  );
}
