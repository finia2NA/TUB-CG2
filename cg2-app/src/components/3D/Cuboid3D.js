// https://threejs.org/docs/#api/en/geometries/WireframeGeometry


import { useRef } from "react"

const Cuboid3D = (props) => {
  const ref = useRef()

  return (
    <mesh
      {...props}
      ref={ref}
      position={[...props.representation.position]}>
      <boxGeometry args={[...props.representation.dimensions]} /> {/* array: [width, height, depth] */}
      <meshStandardMaterial wireframe />
    </mesh >
  )

}

export default Cuboid3D