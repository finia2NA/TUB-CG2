/*
NOTE:
Almost made it to the end of this project without creating a util folder. Just need a place to put this function.
*/


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
};
