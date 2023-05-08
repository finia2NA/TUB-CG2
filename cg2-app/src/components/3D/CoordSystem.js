import { Text } from "@react-three/drei";
import { Vector3 } from "three";


const CoordLine = ({ axis, len }) => {
  const start = [0, 0, 0];
  start[axis] = -len / 2;

  // TODO: fix this
  const end = [0, 0, 0];
  end[axis] = len / 2;

  const startVector = new Vector3(...start)
  const endVector = new Vector3(...end)

  return (
    <line>
      <bufferGeometry attach="geometry" setFromPoints={[startVector, endVector]} />
      <lineBasicMaterial attach="material" color="white" />
    </line>
  )
};

export default function CoordSystem({ size }) {

  const axis = [0, 1, 2];
  const dataPoints = axis.map((ax) => {
    const label = ax === 0 ? "X" : ax === 1 ? "Y" : "Z";
        const positions = [[0, 0, 0], [0, 0, 0]];
        positions[0][ax] = size / 2 + 1;
        positions[1][ax] = -size / 2 + 1;
        return {label, positions}
  })

  return (
    <group>
      {axis.map((ax, i) => {
        const label = ax === 0 ? "X" : ax === 1 ? "Y" : "Z";
        const positions = [[0, 0, 0], [0, 0, 0]];
        positions[0][ax] = size / 2 + 1;
        positions[1][ax] = -size / 2 + 1;
        // TODO: fix key issue
        return (
          <>
            {positions.map((position, j) => (
              <Text
                key={j}
                color="white" // default
                anchorX="center" // default
                anchorY="middle" // default
                position={position}
                scale={[2, 2, 2]}
              >{(j === 0 ? "+" : "-") + label}</Text>)
            )}
          </>
        )
      })}
      {axis.map((ax) => (
        <CoordLine key={ax} axis={ax} len={size} />
      ))}
    </group>
  );
}
