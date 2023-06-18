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
    return bbDiagonal * 1.01
  }

  calculateOffsetPoints() {
    // Type N: vector3
    // Note to self: use typeScript next time

    let alpha = this.computeInitialAlpha();
    let posOffsetPoints = new PointDataStructure();
    let negOffsetPoints = new PointDataStructure();
    let idx = 0

    while (idx < this._basePoints.points.length) {
      const position = this._basePoints.points[idx].position;
      const normal = this._basePoints.points[idx].normal;

      const plusNormalPoint = new PointRep(position.clone().add(normal));
      const minusNormalPoint = new PointRep(position.clone().sub(normal));

      const nearestNeighbor = this._basePoints.findNearest(plusNormalPoint).point

      if (nearestNeighbor.position.equals(position)) {
        posOffsetPoints.push(plusNormalPoint);
        negOffsetPoints.push(minusNormalPoint);

        plusNormalPoint.functionValue = alpha;
        minusNormalPoint.functionValue = -alpha;

        idx += 1
      }

      else {
        posOffsetPoints = new PointDataStructure();
        negOffsetPoints = new PointDataStructure();
        idx = 0;
        alpha = alpha / 2;
      }
    }

    this._3NPoints = new PointDataStructure(this._basePoints.points.concat(posOffsetPoints).concat(negOffsetPoints));
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
    const D = pointArray.map(point => point.distance3DToPosition(new Vector3(x, y, z)));
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
    const result1 = math.multiply(polyBases, coefficients); // this is what copilot says, TODO: check if this is correct
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


  calculateGridValues(nx, ny, nz) {
    const bb = this.getBoundingBox();

    // set up from where to where and in what steps to iterate
    const xRange = bb.max.x - bb.min.x;
    const yRange = bb.max.y - bb.min.y;
    const zRange = bb.max.z - bb.min.z;
    const xStep = xRange / nx;
    const yStep = yRange / ny;
    const zStep = zRange / nz;

    // create grid 3d array
    const grid = new Array(nx).fill().map(() => new Array(ny).fill().map(() => new Array(nz)));

    // fill grid with points
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        for (let k = 0; k < nz; k++) {
          const x = bb.xMin + i * xStep;
          const y = bb.yMin + j * yStep;
          const z = bb.zMin + k * zStep;

          const thePoint = new PointRep(new Vector3(x, y, z))
          thePoint.functionValue = this._wls(x, y, z, 0.1).functionValue;
          grid[i][j][k] = thePoint
        }
      }
    }

    this.pointGrid = grid;
  }


}

export default Implicit