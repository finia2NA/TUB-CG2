import { useRef, useState } from "react"

// this is the component that *renders* a single point in 3D space
// it represents a PointRep object

const spriteSizes = [0.03, 0.02]

const Point3D = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()

  // Set up state for the hovered state
  const [hovered, setHover] = useState(false)

  let materials = props.materials

  if (!materials) {
    console.warn("Point3D did not receive cached materials, reverting to inbuilt generator")
    const colors = ["orange", "blue", "red"]
    materials = colors.map(
      color => <spriteMaterial color={color} />
    )
  }

  let materialIndex = 0
  if (props.highlighted) {
    materialIndex = 1
  }

  if (props.selected || hovered) {
    materialIndex = 2
  }


  // Return the view, these are regular Threejs elements expressed in JSX
  return (

    // TODO: make this a circle instead of a square
    <sprite
      {...props}
      position={props.representation.position}
      ref={ref}
      scale={hovered ? [spriteSizes[0], spriteSizes[0], spriteSizes[0]] : [spriteSizes[1], spriteSizes[1], spriteSizes[1]]}
      onPointerOver={(event) => setHover(true)}
      onClick={(event) => props.onClick(props.representation)}
      onPointerOut={(event) => setHover(false)}>
      {materials[materialIndex]}
    </sprite>
  )
}

export default Point3D