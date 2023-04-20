import { useRef, useState } from "react"

// this is the component that *renders* a single point in 3D space
// it represents a PointRep object

const Point3D = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()

  // Set up state for the hovered state
  const [hovered, hover] = useState(false)

  // Set up color
  let myColor = "orange"
  if (props.selected || hovered) {
    myColor = "red"
  }
  if (props.highlighted) {
    myColor = "green"
  }

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      position={[props.representation.x, props.representation.y, props.representation.z]}
      ref={ref}
      scale={hovered ? [1.3, 1.3, 1.3] : [1, 1, 1]}
      onPointerOver={(event) => hover(true)}
      onClick={(event) => props.onClick(props.representation)}
      onPointerOut={(event) => hover(false)}>
      <sphereGeometry args={[0.01, 32, 32]} /> {/* array: [radius, widthSegments, heightSegments] */}
      <meshStandardMaterial color={myColor} />
    </mesh>
  )
}

export default Point3D