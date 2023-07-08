import { Vector3 } from "three";
import * as math from "mathjs";

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
    const laplacian = sum.sub(point.position.clone().multiplyScalar(n));
    point.laplacian = laplacian;
  }
}

export const laplaceSmooth = (pointDS, lambda = 1000000, steps = 1) => {
  // NOTE TO READERS:
  // this function is in-place, so make sure you pass a copy of the pointDS if you want to keep the original
  // OR if pointDS is a react STATE!

  // To smooth the mesh, move each vertex along the direction of its Laplacian vector. The distance you move the vertex can be modulated by a scalar value, typically called the "smoothing factor" or "time step". For example, if the smoothing factor is 0.5, each vertex is moved halfway along its Laplacian vector. This step is also sometimes referred to as "relaxation".
  // Depending on the desired level of smoothness, you may want to repeat this multiple times
  for (let i = 0; i < steps; i++) {
    graphLaplacian(pointDS);
    const points = pointDS.points;
    for (const point of points) {
      point.position.add(point.laplacian.multiplyScalar(lambda));
      // console.log(point.laplacian)
    }
  }
  // After the final smoothing operation, you need to recompute the normals for each vertex or face, as these will have changed when the vertices moved.
  computeNormals(pointDS);
  return pointDS;
}

export const cotanLaplacian = (pointDS) => {
  const points = pointDS.points;
  const num = points.length;

  let cotan = Array.from({ length: num }, () => Array(num).fill(0));
  let mass = Array.from({ length: num }, () => Array(num).fill(0));

  for (const point of points) {
    const connected = point.tier1Neighbours()
    for (const neighbor of connected) {
      let w = 0;
      
      const n_neighbor = neighbor.tier1Neighbours();
      const intersection = connected.filter(x => n_neighbor.includes(x));

      for (const intersect of intersection) {
        const vector1 = new Vector3().subVectors(point.position, intersect.position);
        const vector2 = new Vector3().subVectors(neighbor.position, intersect.position);
        w += 1 / (2 * Math.tan(vector1.angleTo(vector2)));
      }

      cotan[point.index][neighbor.index] = w
    }

    const areas = point.faces.map(face => face.area);
    let A = 0;
    for (const area of areas) {
      A += (1/3) * area;
    }
    mass[point.index][point.index] = A;
  }

  for (let i=0; i<num; i++) {
    const w_diag = -(cotan[i].reduce((a, b) => a+b, 0));
    console.log(cotan[i])
    cotan[i][i] = w_diag;
    console.log(w_diag)
  }

  const laplacianOperator = math.multiply(math.inv(mass), cotan);

  return laplacianOperator;
}

export const cotanSmooth = (pointDS, lambda = 1, steps = 1) => {
  for (let i=0; i<steps; i++) {
    const laplacianOperator = cotanLaplacian(pointDS);
    const points = pointDS.points;
    const position = points.map(point => [point.position.x, point.position.y, point.position.z]);

    const delta = math.multiply(laplacianOperator, position);

    for (let j=0; j<points.length; j++) {
      const delVector = new Vector3(delta[j][0], delta[j][1], delta[j][2]);
      delVector.normalize();
      points[j].position.add(delVector.multiplyScalar(lambda));
    }
  }

  computeNormals(pointDS);
  return pointDS;
}

export const eulerSmooth = (pointDS, lambda = 1, steps = 1) => {
  throw new Error("Not implemented");
}