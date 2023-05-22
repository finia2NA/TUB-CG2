// This probably needs a lot of vector math, esp. to solve the system of equations
// Possible libraries to use:
// eigen https://www.npmjs.com/package/eigen
// math.js https://mathjs.org/docs/reference/functions/usolve.html

import { SampledPointRep } from "./SampledPointRep";

class Surface {
  constructore(basePoints) {
    this.basePoints = basePoints;
    this.surfaceFunction = null;
  }

  computeSurfaceFunction(x,y) {
    // Task 1
    // (x,y) is arbitrary point

    // Is this.basePoints is same as this.points in pointDataStructures?
    // I assumed that this.basePoints is the array of PointRep
    const points = this.basePoints.map(point => point.position.toArray());
    const X = points.map(row => row[0]);
    const Y = points.map(row => row[1]);
    const Z = points.map(row => row[2])
    // Calculating distance (for weight)
    const D = points.map(point => ((point.position.toArray()[0]-x)**2+(point.position.toArray()[1]-y)**2)**0.5);

    // weighting function
    const weighting_f = (r) => {
      return ((1-r)**4)*(4*r+1);
    }

    const W = []; // weight value
    for (let i = 0; i < D.length; i++) {
      const weight = weighting_f(D[i]);
      W[i] = weight;
    }

    const P = []; // arguments for quadratic polynomial
    for (let i = 0; i < X.length; i++) {
      P.push([1, X[i], Y[i], X[i]*Y[i], X[i]**2, Y[i]**2])
    }

    const PT = math.transpose(P);
    const PW = math.multiply(math.diag(W), P);
    const PT_P_inv = math.inv(math.multiply(PT, PW));
    const PT_Z = math.multiply(PT, math.multiply(math.diag(W), Z));
    const coef = math.multiply(PT_P_inv, PT_Z);

    const z = coef[0][0] + coef[1][0]*x + coef[2][0]*y + coef[3][0]*x*y + coef[4][0]*(x**2) + coef[5][0]*(y**2);

    return z

    // console.error("Not implemented");
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