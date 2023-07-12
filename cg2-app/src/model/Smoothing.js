import { Vector3 } from "three";
import * as math from "mathjs";
import choleskySolve from "cholesky-solve"

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

/* in-place operation*/ 
export const graphLaplacian = (pointDS) => {

  for (const point of pointDS.points) {
    // calculate: sum(f_vj-f_vi)
    const neighbours = point.tier1Neighbours();
    const n = neighbours.length;
    const sum = neighbours.reduce((sum, neighbour) => sum.add(neighbour.position), new Vector3());
    const laplacian = sum.sub(point.position.clone().multiplyScalar(n));

    // calculate: 1/n*sum
    point.laplacian = laplacian.multiplyScalar(1/n);
  }
}

export const laplaceSmooth = (pointDS, lambda = 0.2, steps = 1) => {
  for (let i = 0; i < steps; i++) {
    graphLaplacian(pointDS);
    for (const point of pointDS.points) {
      point.position.add(point.laplacian.multiplyScalar(lambda));
    }
  }
  computeNormals(pointDS);
  return pointDS;
}

export const cotanLaplacian = (pointDS) => {

  // init
  const points = pointDS.points;
  const num = points.length;
  let cotan = Array.from({ length: num }, () => Array(num).fill(0));
  let mass = Array.from({ length: num }, () => Array(num).fill(0));

  for (const point of points) {

    // calc L: i/=j
    const connected = point.tier1Neighbours()
    let faces = point.faces.map(x => x.index)

    for (const neighbor of connected) {      
      // get 2 points  
      let intersection = neighbor.faces.filter(x => faces.includes(x.index));
      intersection =  Array.from(new Set(intersection.reduce((a,b) => a.concat(b.points),[])))
      intersection = intersection.filter(x => x.index!=point.index && x.index!=neighbor.index)
      
      // calculate cotan and angles
      for (const intersect of intersection) {
        const vector1 = new Vector3().subVectors( intersect.position,point.position);
        const vector2 = new Vector3().subVectors( intersect.position,neighbor.position);
        cotan[point.index][neighbor.index] += 1 / (2 * Math.tan(vector1.angleTo(vector2)));
      }
    }

    // calc mass M
    const areas = point.faces.map(face => face.area);
    mass[point.index][point.index] = 1/(areas.reduce((a,b) => a+1/3*b,0));
  }

  // calc cotan i==j
  for (let i=0; i<num; i++) {
    cotan[i][i] = -(cotan[i].reduce((a, b) => a+b, 0));
  }

  return {mass, cotan}
}

export const cotanSmooth = (pointDS, lambda = 1, steps = 1) => {
  for (let i=0; i<steps; i++) {
    // init
    const {mass, cotan} = cotanLaplacian(pointDS);
    const points = pointDS.points;
    const position = points.map(point => [point.position.x, point.position.y, point.position.z]);
    
    // M*L*f
    const laplacianOperator = math.multiply(mass, cotan);
    const delta = math.multiply(laplacianOperator, position);

    // set new position
    for (let j=0; j<points.length; j++) {
      const delVector = new Vector3(delta[j][0], delta[j][1], delta[j][2]);
      points[j].position.add(delVector.multiplyScalar(lambda));
    }
  }

  computeNormals(pointDS);
  return pointDS;
}

export const cotanSmoothImplicit = (pointDS, lambda = 0.01, steps = 1) => {
  for (let i=0; i<steps; i++) {
    // init
    const {mass, cotan} = cotanLaplacian(pointDS);
    const points = pointDS.points;
    const positions = points.map(point => [point.position.x, point.position.y, point.position.z]);

    // set variables for: Nx = b 
    const N = math.subtract(mass, math.multiply(lambda, cotan)) // N = mass-lambda*cotan
    const b = math.multiply(mass, positions) // b = mass*points
    const b_1 = b.map(x => x[0]);
    const b_2 = b.map(x => x[1]);
    const b_3 = b.map(x => x[2]);

    // get sparse matrix of N
    let N_sparse = [];
    for (let i = 0; i < N.length; i++) {
      for (let j = i; j < N[i].length; j++) {
        if (N[i][j] !== 0) {
          N_sparse.push([i, j, N[i][j]]);
        }
      }
    }
    
    // solving with sparse Cholesky
    const x = choleskySolve.prepare(N_sparse, N.length)(b_1)
    const y = choleskySolve.prepare(N_sparse, N.length)(b_2)
    const z = choleskySolve.prepare(N_sparse, N.length)(b_3)

    // set new position
    if (!(x.some(Number.isNaN) || y.some(Number.isNaN) ||z.some(Number.isNaN) )) {
      for (let j=0; j<points.length; j++) {
        points[j].position = new Vector3(x[j], y[j], z[j]);
      }
    }

    // compute normals
    computeNormals(pointDS);
  }
  return pointDS;
}


export const eigenSmooth = (pointDS, eigenPercentage=0.99, steps = 1) => {
  for (let i=0; i<steps; i++) {
    // init
    const {cotan} = cotanLaplacian(pointDS);
    const coords = pointDS.points.map(point => [point.position.x,point.position.y,point.position.z]);

    // Compute eigenvectors
    let eigenvectors = math.transpose(math.eigs(cotan).vectors)
    eigenvectors = eigenvectors.slice(0,Math.floor(eigenvectors.length*eigenPercentage))
    
    // Compute new coordinates 
    let result = math.multiply(math.transpose(coords), math.transpose(eigenvectors));
    result = math.multiply(result, eigenvectors);

    // set new position
    for (let j=0; j<result[0].length; j++) {
      pointDS.points[j].position = new Vector3(result[0][j], result[1][j], result[2][j]);
    }
  }
  
  // compute normals
  computeNormals(pointDS);

  return pointDS
}