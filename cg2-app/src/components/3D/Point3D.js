import { useRef, useState } from "react"

// this is the component that *renders* a single point in 3D space
// it represents a PointRep object

const spriteSizes = [0.03, 0.02]

const Point3D = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()

  // Set up state for the hovered state
  const [hovered, setHover] = useState(false)

  // Set up color
  let myColor = "orange"

  if (props.highlighted) {
    myColor = "blue"
  }

  if (props.selected || hovered) {
    myColor = "red"
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
      <spriteMaterial color={myColor} />
    </sprite>
  )
}

export default Point3D