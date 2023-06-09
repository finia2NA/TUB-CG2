// This probably needs a lot of vector math, esp. to solve the system of equations
// Possible libraries to use:
// eigen https://www.npmjs.com/package/eigen
// math.js https://mathjs.org/docs/reference/functions/usolve.html

import { Vector2, Vector3 } from "three";
import PointRep from "./PointRep";
import * as math from "mathjs";

class Surface {
  constructor(basePoints) {
    this._basePoints = basePoints;
    this._storedLSCoefficients = null;
  }

  getPointArray() {
    let pointArray = null;
    if (this._basePoints instanceof Array)
      pointArray = this._basePoints;
    else {
      pointArray = this._basePoints.toArray();
    }
    return pointArray;
  }

  ls(x, y) {
    if (!this._storedLSCoefficients) {
      const pointArray = this.getPointArray()
      const positions = pointArray.map(point => point.position.toArray());
      const X = positions.map(row => row[0]);
      const Y = positions.map(row => row[1]);
      const Z = positions.map(row => row[2])

      const polyBases = []

      for (let i = 0; i < X.length; i++) {
        polyBases.push([1, X[i], Y[i], X[i] * Y[i], X[i] ** 2, Y[i] ** 2])
      }

      const squarePolyBases = math.multiply(math.transpose(polyBases), polyBases);
      const squarePolyBasesInv = math.inv(squarePolyBases);

      this._storedLSCoefficients = math.multiply(math.multiply(squarePolyBasesInv, math.transpose(polyBases)), Z);
    }

    const coefficients = this._storedLSCoefficients;
    const result = coefficients[0] + coefficients[1] * x + coefficients[2] * y + coefficients[3] * x * y + coefficients[4] * x ** 2 + coefficients[5] * y ** 2;

    return new PointRep(new Vector3(x, y, result))
  }

  wls(x, y, weightVector) {
    const pointArray = this.getPointArray();
    const positions = pointArray.map(point => point.position.toArray());
    const X = positions.map(row => row[0]);
    const Y = positions.map(row => row[1]);
    const Z = positions.map(row => row[2])

    const polyBases = []
    // polybases will be a matrix of n rows and 6 columns
    for (let i = 0; i < X.length; i++) {
      polyBases.push([1, X[i], Y[i], X[i] * Y[i], X[i] ** 2, Y[i] ** 2])
    }

    // compute weight vector if not given
    if (!weightVector) {
      const D = pointArray.map(point => point.distance2DToPosition(new Vector2(x, y)));
      const weighting_f = (r, h = 0.1) => {
        return (((1 - r) / h) ** 4) * (4 * r / (h + 1));
      }
      weightVector = []; // weight value
      for (let i = 0; i < D.length; i++) {
        const weight = weighting_f(D[i]);
        weightVector[i] = weight;
      }
    }


    // apply the weights to the polybases
    const weightedPolyBases = math.multiply(math.diag(weightVector), polyBases)

    // Q: Why are the things that are not transposed in the paper transposed here and vice versa?
    // A: Because the paper is written for col vectors, but the library is row vectors.

    // leftSide and rightSide refer to the equation in the paper.
    const leftSide = math.multiply(math.transpose(polyBases), weightedPolyBases);
    const rightSide = math.multiply(math.transpose(weightedPolyBases), Z);
    const coefficients = math.multiply(math.inv(leftSide), rightSide);
    const result = coefficients[0] + coefficients[1] * x + coefficients[2] * y + coefficients[3] * x * y + coefficients[4] * x ** 2 + coefficients[5] * y ** 2;

    // COMPUTE NORMALS
    const xDerivative = coefficients[1] + coefficients[3] * y + 2 * coefficients[4] * x;
    const yDerivative = coefficients[2] + coefficients[3] * x + 2 * coefficients[5] * y;
    const normal = new Vector3(-xDerivative, -yDerivative, 1).normalize();

    return new PointRep(new Vector3(x, y, result), normal)
  }

  getMovingSampling(xCount, yCount, multiplier , approximationMethod) {
    const bb = this._basePoints.getBoundingBox();
    const xIntervals = Array.from({ length: xCount }, (_, i) => i / (xCount - 1));
    const yIntervals = Array.from({ length: yCount }, (_, i) => i / (yCount - 1));
    const xValues = xIntervals.map(x => x * (bb.max.x - bb.min.x) + bb.min.x);
    const yValues = yIntervals.map(y => y * (bb.max.y - bb.min.y) + bb.min.y);

    let sampledPoints = [];
    for (let x of xValues) {
      const row = [];
      for (let y of yValues) {

        let surfaceFunction = null
        switch (approximationMethod) {
          case "ls":
            surfaceFunction = this.ls.bind(this)
            break;
          case "wls":
            surfaceFunction = this.wls.bind(this)
            break;
          case "btps":
          case 'mls':
            // this is MLS!
            const pointArray = this.getPointArray();
            const D = pointArray.map(point => point.distance2DToPosition(new Vector2(x, y)));

            // this is the function described in the paper for mls
            const weightFunctionEpsilon = (d, epsilon = 0.001) => {
              return 1 / (d ** 2 + epsilon ** 2)
            }

            const weightVector = []; // weight value
            for (let i = 0; i < D.length; i++) {
              const weight = weightFunctionEpsilon(D[i]);
              weightVector[i] = weight;
            }
            surfaceFunction = () => this.wls(x, y, weightVector)
            break;

          default:
            console.error("Unknown approximation method")
        }

        const point = surfaceFunction(x, y);
        row.push(point);
      }
      sampledPoints.push(row);
    }

    if (approximationMethod === "btps") {
      sampledPoints = this.getDecasteljauSampling(sampledPoints, multiplier)
    }

    return sampledPoints;
  }

  getDecasteljauSampling(points, k) {
    // init
    const m = points.length;
    const n = points[0].length;
    const sampledPoints = [];

    // loop over km x kn array
    for (let i = 0; i < k*m; i++) {
      const row = [];
      for (let j = 0; j < k*n; j++) {
        const point = this.deCasteljau(points, i / (k*m), j / (k*n));
        row.push(point);
      }
      sampledPoints.push(row);
    }
    return sampledPoints;
  }

  deCasteljau(controlPoints, u, v){
    let m = controlPoints.length;
    let n = controlPoints[0].length;
    let newPoints = [];

    // base case
    if (m === 1 && n === 1) {
      return controlPoints[0][0];
    }

    //loop over control points
    for (let i = 1; i < m; i++) {
      let row = [];
      for (let j = 1; j < n; j++) {
        // get neighboring points
        const p0 = controlPoints[i - 1][j - 1].position
        const p1 = controlPoints[i][j - 1].position
        const p2 = controlPoints[i - 1][j].position
        const p3 = controlPoints[i][j].position

        // interpolate
        const q0 = p0.clone().lerp(p1, u);
        const q1 = p2.clone().lerp(p3, u);
        const point = q0.clone().lerp(q1, v);

        // compute normal
        const tangentU = p1.clone().sub(p0).multiplyScalar(u);
        const tangentV = q1.clone().sub(q0).multiplyScalar(v);
        const normal = new Vector3().crossVectors(tangentU, tangentV).normalize();
        row.push(new PointRep(point,normal));
      }
      newPoints.push(row);
    }
    return this.deCasteljau(newPoints, u, v);
  }
}

export default Surface;