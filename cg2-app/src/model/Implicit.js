import { KDTreePointDataStructure as PointDataStructure } from './pointDataStructures';
import { Vector3 } from "three";
import PointRep from './PointRep';
import * as math from "mathjs";
import { BasisFunction } from './BasisFunction';

class Implicit {
  constructor(basePoints) {
    this._basePoints = basePoints;
    this._3NPoints = null;
    this.pointGrid = null;
  }

  computeInitialAlpha() {
    const bb = this._basePoints.getBoundingBox();
    const bbDiagonal = bb.max.distanceTo(bb.min)
    return bbDiagonal * 0.01
  }

  calculateOffsetPoints() {
    // Type N: vector3
    // Note to self: use typeScript next time

    const baseAlpha = this.computeInitialAlpha();
    const posOffsetPoints = []
    const negOffsetPoints = []

    for (const sign of [-1, 1]) {
      // do this whole thing twice, once for positive and once for negative offset
      const offsetList = sign === 1 ? posOffsetPoints : negOffsetPoints;

      for (const point of this._basePoints.points) {
        let currentAlpha = baseAlpha

        while (true) {
          // compute points
          const offsetVector = point.normal.clone().multiplyScalar(sign * currentAlpha);
          const offsetPoint = new PointRep(point.position.clone().add(offsetVector), point.normal.clone());
          offsetPoint.functionValue = sign * currentAlpha;

          // check taht the original point is the closest point to the offset point
          const closestPoint = this._basePoints.findNearest(offsetPoint);
          if (closestPoint === point) {
            // if check was positive, add points to offsetPoint to DS and break
            offsetList.push(offsetPoint);
            break;
          } else {
            // if check was negative, halve currentAlpha and try again
            currentAlpha = currentAlpha / 2;
          }
        }
      }
    }


    this._3NPoints = new PointDataStructure()
    this._3NPoints.points = [...this._basePoints.points, ...posOffsetPoints, ...negOffsetPoints];
    this._3NPoints.buildTree();
  }

  _wls(x, y, z, h, degree = 0, computeNormals = false) {
    // adapted from surface.js with help from my dear friend, Chad G. Peté
    // https://chat.openai.com/share/7e6aeaf8-d5a6-43a7-85e5-8ac1271c1151

    // get relevant values
    const pointArray = this._3NPoints.points;
    const positions = pointArray.map(point => point.position.toArray());
    const X = positions.map(row => row[0]);
    const Y = positions.map(row => row[1]);
    const Z = positions.map(row => row[2]);
    const F = pointArray.map(point => point.functionValue); // interpolated function value

    // choose and compute polybase
    const basisFunction = new BasisFunction(degree);
    let polyBases = [];
    for (let i = 0; i < X.length; i++) {
      polyBases.push(basisFunction.getBasisFunctionArray(X[i], Y[i], Z[i]))
    }

    // compute weight vector
    const D = pointArray.map(point => point.distanceToPosition(new Vector3(x, y, z)));
    // TODO: we had problems with wendland in surface.js, so check if this is correct before submission
    const weighting_f = (r) => {
      return (((1 - r) / h) ** 4) * (4 * r / h + 1);
    }
    let weightVector = []; // weight value
    for (let i = 0; i < D.length; i++) {
      const weight = weighting_f(D[i]);
      weightVector[i] = weight;
    }

    // apply the weights to the polybases
    const weightedPolyBases = math.multiply(math.diag(weightVector), polyBases)

    // leftSide and rightSide refer to the equation in the paper.
    const leftSide = math.multiply(math.transpose(polyBases), weightedPolyBases);
    const rightSide = math.multiply(math.transpose(weightedPolyBases), F);
    const coefficients = math.multiply(math.inv(leftSide), rightSide);

    // compute the result
    const result = basisFunction.evaluate(x, y, z, coefficients);

    // RETURN CASE: NO NORMALS
    if (!computeNormals) {
      const re = new PointRep(new Vector3(x, y, z));
      re.functionValue = result;
      return re;
    }

    // ------------------
    // NORMAL COMPUTATION
    const normal = basisFunction.evaluateGradient(x, y, z, coefficients);
    // RETURN
    const re = new PointRep(new Vector3(x, y, z, normal));
    re.functionValue = result;
    return re;
  }

  _asyncWLS(x, y, z, h, degree = 0, computeNormals = false) {
    return Promise.resolve(this._wls(x, y, z, h, degree, computeNormals));
  }



  async calculateGridValues(nx, ny, nz) {
    // TODO: use worker threads to speed this up
    // https://chat.openai.com/share/bf388ef3-a0d6-42ed-a483-496290c7a406
    this.calculateOffsetPoints();
    const bb = this._3NPoints.getBoundingBox();

    // set up from where to where and in what steps to iterate
    const xRange = bb.max.x - bb.min.x;
    const yRange = bb.max.y - bb.min.y;
    const zRange = bb.max.z - bb.min.z;
    const xStep = xRange / nx;
    const yStep = yRange / ny;
    const zStep = zRange / nz;

    const totalSteps = nx * ny * nz;

    // create grid 3d array
    const grid = new Array(nx).fill().map(() => new Array(ny).fill().map(() => new Array(nz)));

    // fill grid with points
    console.log("computing grid values...")
    let progressIndex = 0
    const promises = [];
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        for (let k = 0; k < nz; k++) {
          const x = bb.min.x + i * xStep;
          const y = bb.min.y + j * yStep;
          const z = bb.min.z + k * zStep;

          // Push the promises into the promises array
          promises.push(
            this._asyncWLS(x, y, z, 0.1).then(wlsPoint => {
              grid[i][j][k] = wlsPoint

              // print progress
              // const currentStep = i * ny * nz + j * nz + k;
              // if ((currentStep / totalSteps) * 10 > progressIndex) {
              //   console.log(`${progressIndex * 10}%`)
              //   progressIndex++;
              // }
            })
          );
        }
      }
    }

    // Wait for all promises to be resolved
    await Promise.all(promises);
    console.log("done computing grid values")


    this.pointGrid = grid;
    return grid;
  }
}

export default Implicit