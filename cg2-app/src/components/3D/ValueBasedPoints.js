import SubPointCloud2 from "./SubPointCloud2";

const flattenArray = data => {
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
  // debugger;
  const points = flattenArray(props.points)

  let min = Number.MAX_VALUE
  for (const p of points) {
    console.log(p.functionValue)
    if (p.functionValue < min) {
      min = p.functionValue
    }
  }
  console.log("------------------")
  console.log(min)

  return (
    <SubPointCloud2 points={points} vertexSize={20} valueBasedColoring />
  )

}

export default ValueBasedPoints