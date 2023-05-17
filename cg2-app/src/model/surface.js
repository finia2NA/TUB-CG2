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

  computeSurfaceFunction() {
    console.error("Not implemented");
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