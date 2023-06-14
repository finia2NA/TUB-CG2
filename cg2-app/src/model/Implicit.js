import { KDTreePointDataStructure as PointDataStructure } from './pointDataStructures';
import { Vector3 } from "three";
import PointRep from './PointRep';

class Implicit {
  constructor(basePoints) {
    this._basePoints = basePoints;
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

  getOffsetPoints() {
    // Type N: vector3
    // Note to self: use typeScript next time
    var alpha = this.computeInitialAlpha();
    var posNormal = new PointDataStructure();
    var negNormal = new PointDataStructure();
    var idx = 0

    // debug code
    const N = this._basePoints.points.map(p=>p.normal);
    console.log(N);

    while (idx < this._basePoints.points.length) {
      const position = this._basePoints.points[idx].position;
      const normal = this._basePoints.points[idx].normal;

      const positionPlusNormal = new PointRep(position.clone().add(normal));
      const positionMinusNormal = new PointRep(position.clone().sub(normal));

      const nearestNeighbor = this._basePoints.findNearest(positionPlusNormal).point.position;

      if (nearestNeighbor.equals(position)) {
        posNormal.addPoint(positionPlusNormal);
        negNormal.addPoint(positionMinusNormal);

        posNormal.functionValue[positionPlusNormal.position.toArray()] = alpha;
        negNormal.functionValue[positionMinusNormal.position.toArray()] = (-1) * alpha;

        idx += 1
      }

      else {
        posNormal = new PointDataStructure();
        negNormal = new PointDataStructure();
        idx = 0;
        alpha = alpha / 2;
      }
    }

    return { posNormal: posNormal, negNormal: negNormal }
  }

}

export default Implicit