import { Vector3 } from "three";

export const computeNormals = (pointDS) => {
  const points = pointDS.points;
  for (const point of points) {
    const weights = point.faces.map(face => face.area);
    const normals = point.faces.map(face => face.normal);
    const normal = new Vector3()
    for (let i = 0; i < weights.length; i++) {
      normal.addScaledVector(normals[i], weights[i]);
    }
    normal.normalize();
    point.normal = normal;
  }
}

export const graphLaplacian = (pointDS) => {
  // The Laplacian at a point is calculated as the average of the differences between a point and each of its neighbors. For each vertex, calculate the sum of the positions of its neighboring vertices and subtract the product of the degree of the vertex (number of neighboring vertices) and the vertex position. This results in a Laplacian vector for each vertex.
  const points = pointDS.points;
  for (const point of points) {
    const neighbours = point.tier1Neighbours();
    const n = neighbours.length;
    const sum = neighbours.reduce((sum, neighbour) => sum.add(neighbour.position), new Vector3());
    const laplacian = sum.sub(point.position.multiplyScalar(n));
    point.laplacian = laplacian;
  }
}

export const smooth = (pointDS, lambda = 0.5, steps = 1) => {
  // NOTE TO READERS:
  // this function is in-place, so make sure you pass a copy of the pointDS if you want to keep the original
  // OR if pointDS is a react STATE!

  // To smooth the mesh, move each vertex along the direction of its Laplacian vector. The distance you move the vertex can be modulated by a scalar value, typically called the "smoothing factor" or "time step". For example, if the smoothing factor is 0.5, each vertex is moved halfway along its Laplacian vector. This step is also sometimes referred to as "relaxation".
  // Depending on the desired level of smoothness, you may want to repeat this multiple times
  for (let i = 0; i < steps; i++) {
    graphLaplacian(pointDS);
    debugger;
    const points = pointDS.points;
    for (const point of points) {
      point.position.add(point.laplacian.multiplyScalar(lambda));
    }
  }
  // After the final smoothing operation, you need to recompute the normals for each vertex or face, as these will have changed when the vertices moved.
  computeNormals(pointDS);
  debugger;
  return pointDS;
}