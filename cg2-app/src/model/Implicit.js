import { KDTreePointDataStructure as PointDataStructure } from './pointDataStructures';
import { Vector3 } from "three";
import PointRep from './PointRep';

class Implicit {
  constructor(basePoints) {
    this._basePoints = basePoints;
    this._3NPoints = null;
  }

  computeInitialAlpha() {
    const bb = this._basePoints.getBoundingBox();
    const x = (bb.max.x - bb.min.x) + 0.1;
    const y = (bb.max.y - bb.min.y) + 0.1;
    const z = (bb.max.z - bb.min.z) + 0.1;

    const diagonal = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

    const alpha = 0.01 * diagonal;

    return alpha;
  }

  calculateOffsetPoints() {
    // Type N: vector3
    // Note to self: use typeScript next time
    var alpha = this.computeInitialAlpha();
    var posOffsetPoints = []
    var negOffsetPoints = []
    var idx = 0

    // debug code
    const N = this._basePoints.points.map(p => p.normal);
    console.log(N);

    while (idx < this._basePoints.points.length) {
      const position = this._basePoints.points[idx].position;
      const normal = this._basePoints.points[idx].normal;

      const positionPlusNormal = new PointRep(position.clone().add(normal));
      const positionMinusNormal = new PointRep(position.clone().sub(normal));

      const nearestNeighbor = this._basePoints.findNearest(positionPlusNormal).point.position;

      // FIXME: this check should be wether the posPlusNormal is closer to position than nearestneighbour, not if nearestneighbour is equals to position I think (reading the assignment!)
      if (nearestNeighbor.equals(position)) {
        posOffsetPoints.push(positionPlusNormal);
        negOffsetPoints.push(positionMinusNormal);

        positionPlusNormal.functionValue = alpha;
        positionMinusNormal.functionValue = (-1) * alpha;

        idx += 1
      }

      else {
        // FIXME:  I don't know if assigning posnormal and negnormal to be a new ds here is good!
        // since it resets everything, even for points that have already been processed!!!
        posOffsetPoints = []
        negOffsetPoints = []
        idx = 0;
        alpha = alpha / 2;
      }
    }

    this._3NPoints = new PointDataStructure(this._basePoints.points.concat(posOffsetPoints).concat(negOffsetPoints));
    this._3NPoints.buildTree();
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

          grid[i][j][k] = new PointRep(new Vector3(x, y, z));
        }
      }
    }

    return grid;
  }


}

export default Implicit