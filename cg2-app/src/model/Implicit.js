import { KDTreePointDataStructure as PointDataStructure } from './pointDataStructures';
import { Vector3 } from "three";
import PointRep from './PointRep';
import * as math from "mathjs";
import { BasisFunction } from './BasisFunction';
import { flattenArray } from '../components/3D/ValueBasedPoints';

class Implicit {
  constructor(basePoints, degree, wendlandRadius, baseAlpha) {
    this._basePoints = basePoints;
    this._3NPoints = null;
    this.pointGrid = null;
    this._degree = degree;
    this._wendlandRadius = wendlandRadius;
    this._baseAlpha = baseAlpha;
  }

  computeInitialAlpha() {
    const bb = this._basePoints.getBoundingBox();
    const bbDiagonal = bb.max.distanceTo(bb.min)
    return bbDiagonal * this._baseAlpha;
  }

  calculateOffsetPoints() {

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
          // check that the original point is the closest point to the offset point
          const closestPoint = this._basePoints.findNearest(offsetPoint);
          if (closestPoint === point) {
            // if check was positive, add point to list and break
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

  _wls(x, y, z, degree = 0, computeNormals = false) {
    // adapted from surface.js with help from my dear friend, Chad G. Peté
    // https://chat.openai.com/share/7e6aeaf8-d5a6-43a7-85e5-8ac1271c1151

    // get relevant values
    // const pointArray = this._3NPoints.points;

    const point = new PointRep(new Vector3(x, y, z)) // reference point
    const r = this._wendlandRadius // wendland radius from UI (changeable)

    const target = this._3NPoints.radiusSearch(point, r) // local points for wendland function

    const radiusPoint = new PointDataStructure()
    for (let i=0; i<target.length; i++) {
      radiusPoint.addPoint(target[i]);
    }
    const radiusPointArray = radiusPoint.points;

    const positions = radiusPointArray.map(point => point.position.toArray());
    const X = positions.map(row => row[0]);
    const Y = positions.map(row => row[1]);
    const Z = positions.map(row => row[2]);
    const F = radiusPointArray.map(point => point.functionValue); // interpolated function value

    // choose and compute polybase
    const basisFunction = new BasisFunction(degree);
    let polyBases = [];
    for (let i = 0; i < X.length; i++) {
      polyBases.push(basisFunction.getBasisFunctionArray(X[i], Y[i], Z[i]))
    }
        
    const rD = radiusPointArray.map(point => point.distanceToPosition(new Vector3(x, y, z)));
    const wf_wendland = (d) => {
      return ((1 - d/r) ** 4) * (4 * d/r + 1); // biggest at d=0, zero at d=r 
    }
   

    let weightVector = []; // weight value
    for (let i = 0; i < rD.length; i++) {
      const weight = wf_wendland(rD[i]);
      weightVector[i] = weight;
    }

    // // compute weight vector
    // const D = pointArray.map(point => point.distanceToPosition(new Vector3(x, y, z)));
    // // FIXME: wendland is not working rn, using epsilon instead so Task 4 can be implemented.
    // // Figure out what is going wrong with wendland, then replace epsilon.
    // const wf_epsilon = (d, epsilon = 0.1) => {
    //   return 1 / (d ** 2 + epsilon ** 2)
    // }

    // let weightVector = []; // weight value
    // for (let i = 0; i < D.length; i++) {
    //   const weight = wf_epsilon(D[i]);
    //   weightVector[i] = weight;
    // }

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

  _asyncWLS(x, y, z, degree = this._degree, computeNormals = false) {
    return Promise.resolve(this._wls(x, y, z, degree, computeNormals));
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
    const xStep = xRange / (nx - 1);
    const yStep = yRange / (ny - 1);
    const zStep = zRange / (nz - 1);

    // create grid 3d array
    const grid = new Array(nx).fill().map(() => new Array(ny).fill().map(() => new Array(nz)));

    // fill grid with points
    console.log("computing grid values...")
    const promises = [];
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        for (let k = 0; k < nz; k++) {
          const x = bb.min.x + i * xStep;
          const y = bb.min.y + j * yStep;
          const z = bb.min.z + k * zStep;

          // Push the promises into the promises array
          promises.push(
            this._asyncWLS(x, y, z).then(wlsPoint => {
              grid[i][j][k] = wlsPoint

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