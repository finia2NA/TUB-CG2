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
    this.basePoints = basePoints;
    this.surfaceFunction = this.wls3.bind(this);
  }

  getPointArray() {
    console.log("ho")
    let pointArray = null;
    if (this.basePoints instanceof Array)
      pointArray = this.basePoints;
    else {
      pointArray = this.basePoints.toArray();
    }
    return pointArray;
  }

  weighting_f(r) {
    return ((1 - r) ** 4) * (4 * r + 1);
  }

  ls(x, y) {
    const pointArray = this.getPointArray()
    const positions = pointArray.map(point => point.position.toArray());
    const X = positions.map(row => row[0]);
    const Y = positions.map(row => row[1]);
    const Z = positions.map(row => row[2])

    const polyBase = []


    for (let i = 0; i < X.length; i++) {
      polyBase.push([1, X[i], Y[i], X[i] * Y[i], X[i] ** 2, Y[i] ** 2])
    }

    const squarePolyBase = math.multiply(math.transpose(polyBase), polyBase);
    const squarePolyBaseInv = math.inv(squarePolyBase);
    // debugger;

    const coefficients = math.multiply(math.multiply(squarePolyBaseInv, math.transpose(polyBase)), Z);

    const result = coefficients[0] + coefficients[1] * x + coefficients[2] * y + coefficients[3] * x * y + coefficients[4] * x ** 2 + coefficients[5] * y ** 2;

    return new PointRep(new Vector3(x, y, result))
  }

  wls(x, y) {
    // Task 1

    let pointArray = this.getPointArray();


    const positions = pointArray.map(point => point.position.toArray());
    const X = positions.map(row => row[0]);
    const Y = positions.map(row => row[1]);
    const Z = positions.map(row => row[2])

    // Calculating distance (for weight)
    const D = pointArray.map(point => point.distance2DToPosition(new Vector2(x, y)));

    // weighting function
    const weighting_f = (r) => {
      return ((1 - r) ** 4) * (4 * r + 1);
    }

    const W = []; // weight value
    for (let i = 0; i < D.length; i++) {
      const weight = weighting_f(D[i]);
      W[i] = weight;
    }

    const P = []; // arguments for quadratic polynomial
    for (let i = 0; i < X.length; i++) {
      P.push([1, X[i], Y[i], X[i] * Y[i], X[i] ** 2, Y[i] ** 2])
    }
    debugger;

    const PT = math.transpose(P); // transpose of polybase
    const PW = math.multiply(math.diag(W), P); // weighted polybase
    const PT_P_inv = math.inv(math.multiply(PT, PW));
    const PT_Z = math.multiply(PT, math.multiply(math.diag(W), Z));
    const coef = math.multiply(PT_P_inv, PT_Z);

    // FIXME: coef turns out not to be a 2D array, but a 1D array of length 6
    return coef[0][0] + coef[1][0] * x + coef[2][0] * y + coef[3][0] * x * y + coef[4][0] * (x ** 2) + coef[5][0] * (y ** 2);

  }

  wls2(x, y) {

    // weighting function
    const weighting_f = (r) => {
      return ((1 - r) ** 4) * (4 * r + 1);
    }

    let pointArray = this.getPointArray();

    const weights = [];
    for (let i = 0; i < this.basePoints.length; i++) {
      const weight = weighting_f(pointArray.distance2DToPosition(new Vector2(x, y)));
      weights.push(weight);
    }

  }

  wls3(x, y) {

    // weighting function
    const weighting_f = (r) => {
      return ((1 - r) ** 4) * (4 * r + 1);
    }

    const pointArray = this.getPointArray();

    // Extract x, y, and z values from the points array
    const x_vals = pointArray.map(p => p.position.x);
    const y_vals = pointArray.map(p => p.position.y);
    const z_vals = pointArray.map(p => p.position.z);

    // Calculate the weights for each point based on its distance from the new point
    const distances = pointArray.map(p => p.distance2DToPosition(new Vector2(x, y)))
    const weights = distances.map(d => weighting_f(d));

    // Construct the design matrix
    const X = [];
    for (let i = 0; i < pointArray.length; i++) {
      X.push([1, x_vals[i], y_vals[i]]);
    }

    // Calculate the weighted least squares solution
    const W = weights.map(w => [w, 0, 0]);
    const XtW = numeric.dot(numeric.transpose(X), W);
    const XtWX = numeric.dot(XtW, X);
    const XtWz = numeric.dot(numeric.transpose(X), numeric.dot(W, z_vals));
    const beta = numeric.solve(XtWX, XtWz);

    // Calculate the predicted z value for the new point
    const z_pred = beta[0] + beta[1] * x + beta[2] * y;

    debugger;

    return z_pred;

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