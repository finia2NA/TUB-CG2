import { useEffect, useState } from "react"
import Point3D from "./Point3D"

const PointCloud = (props) => {

  const [colors, setColors] = useState(["orange", "blue", "red"])
  const [materials, setMaterials] = useState(null)

  useEffect(() => {
    const newMaterials = colors.map(
      color => <spriteMaterial color={color} />
    )
    setMaterials(newMaterials)
  }, [colors])

  // might need some more finetuning
  const size = Math.min(20 / props.points.getAllPoints().length, 0.1)

  return (
    props.points.getAllPoints().map((point, index) => (
      <Point3D key={index} representation={point} selected={props.selectedPoints.includes(point)} onClick={props.handlePointClick} highlighted={props.highlightedPoints.includes(point)} materials={materials} size={size} />
    )))

}

export default PointCloud