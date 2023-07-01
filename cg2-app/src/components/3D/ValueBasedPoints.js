import SubPointCloud2 from "./SubPointCloud2";
import React from 'react'; // import React
import { flattenArray } from "../../util/flattenArray";

const ValueBasedPoints = (props) => {
  const points = flattenArray(props.points)

  return (
    <>
      {(props.points && props.points.length > 0) &&
        < SubPointCloud2 points={points} vertexSize={props.vertexSize} valueBasedColoring />
      }

    </>
  )

}

export default ValueBasedPoints