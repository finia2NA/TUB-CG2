// This probably needs a lot of vector math, esp. to solve the system of equations
// Possible libraries to use:
// eigen https://www.npmjs.com/package/eigen
// math.js https://mathjs.org/docs/reference/functions/usolve.html

import { Vector2 } from "three";
import { SampledPointRep } from "./PointRep";
import * as math from "mathjs";

class Surface {
  constructor(basePoints) {
    this.basePoints = basePoints;
    this.surfaceFunction = this.computeSurfaceFunction.bind(this); // todo: change so computeSurfaceFunction actually calculates this
  }

  computeSurfaceFunction(x, y) {
    // Task 1
    // TODO: I believe this function should not take x,y as arguments, but rather compute the polynomial and store a O(1) function in this.surfaceFunction

    let pointArray = null
    if (this.basePoints instanceof Array) pointArray = this.basePoints;
    else {
      pointArray = this.basePoints.toArray();
    }


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

    const PT = math.transpose(P);
    const PW = math.multiply(math.diag(W), P);
    const PT_P_inv = math.inv(math.multiply(PT, PW));
    const PT_Z = math.multiply(PT, math.multiply(math.diag(W), Z));
    const coef = math.multiply(PT_P_inv, PT_Z);

    // FIXME: coef turns out not to be a 2D array, but a 1D array of length 6
    return coef[0][0] + coef[1][0] * x + coef[2][0] * y + coef[3][0] * x * y + coef[4][0] * (x ** 2) + coef[5][0] * (y ** 2);

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