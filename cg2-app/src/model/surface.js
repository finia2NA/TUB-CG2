// This probably needs a lot of vector math, esp. to solve the system of equations
// Possible libraries to use:
// eigen https://www.npmjs.com/package/eigen
// math.js https://mathjs.org/docs/reference/functions/usolve.html

import { Vector2, Vector3 } from "three";
import PointRep, { SampledPointRep } from "./PointRep";
import * as math from "mathjs";
import numeric from "numeric";

class Surface {
  constructor(basePoints) {
    this._basePoints = basePoints;
    this._storedLSCoefficients = null;
    this._storedWLSData = null;
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

  weighting_f(r) {
    return ((1 - r) ** 4) * (4 * r + 1);
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

  wls(x, y) {
    const pointArray = this.getPointArray()
    const positions = pointArray.map(point => point.position.toArray());
    const X = positions.map(row => row[0]);
    const Y = positions.map(row => row[1]);
    const Z = positions.map(row => row[2])

    const polyBases = []
    // polybases will be a matrix of n rows and 6 columns
    for (let i = 0; i < X.length; i++) {
      polyBases.push([1, X[i], Y[i], X[i] * Y[i], X[i] ** 2, Y[i] ** 2])
    }

    // Calculate weight vector
    const D = pointArray.map(point => point.distance2DToPosition(new Vector2(x, y)));
    const weighting_f = (r, h = 0.1) => {
      return (((1 - r) / h) ** 4) * (4 * r / (h + 1));
    }
    const weightVector = []; // weight value
    for (let i = 0; i < D.length; i++) {
      const weight = weighting_f(D[i]);
      weightVector[i] = weight;
    }

    // apply the weights to the polybases
    const weightedPolyBases = math.multiply(math.diag(weightVector), polyBases)

    // left side and right side refer to the equation in the paper.
    const leftSide = math.multiply(math.transpose(polyBases), weightedPolyBases);
    const rightSide = math.multiply(math.transpose(weightedPolyBases), Z);
    const coefficients = math.multiply(math.inv(leftSide), rightSide);
    const result = coefficients[0] + coefficients[1] * x + coefficients[2] * y + coefficients[3] * x * y + coefficients[4] * x ** 2 + coefficients[5] * y ** 2;

    return new PointRep(new Vector3(x, y, result))
  }

  getMLSSampling(uCount, vCount) {
    /**
     * Returns 2D array of SampledPoints, sampled uniformly in the U and V dimensions.
     * If the function was computer using WLS, this will be the MLS surface.
     */


    const sampling = [];
    for (let uIndex = 0; uIndex < uCount; uIndex++) {
      const currentRowResults = [];
      for (let vIndex = 0; vIndex < vCount; vIndex++) {
        const u = uIndex / uCount;
        const v = vIndex / vCount;
        const position = this.surfaceFunction(u, v);
        currentRowResults.push(new SampledPointRep(position, u, v)); // here, the normals can also be stored later
      }
      sampling.push(currentRowResults);
    }
    return sampling;
  }

  getDecasteljauSampling(uCount, vCount, multiplier) {
    console.error("Not implemented");
  }
}

export default Surface;