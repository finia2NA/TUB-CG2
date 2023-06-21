import SubPointCloud2 from "./SubPointCloud2";
import React from 'react'; // import React

export const flattenArray = data => {
  const result = [];

  for (let i = 0, length = data.length; i < length; i++) {
    const value = data[i];

    if (Array.isArray(value)) {
      // If the current item is an array, we need to flatten it as well
      result.push(...flattenArray(value));
    } else {
      // Otherwise, just push the value itself
      result.push(value);
    }
  }

  return result;
}

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