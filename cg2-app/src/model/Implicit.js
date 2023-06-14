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

    const diagonal = Math.sqrt(x**2 + y**2 + z**2);

    const alpha = 0.01*diagonal;
    
    return alpha;
  }

  getOffsetPoints() {
    const N = this._basePoints.normals;
    var alpha = this.computeInitialAlpha();
    var addNormal = new PointDataStructure();
    var subNormal = new PointDataStructure();
    var idx = 0

    while (idx < N.length) {
      const original = N[idx][0].position;
      const Normal = N[idx][1].position.multiplyScalar(alpha);

      const addVector = new PointRep(original.clone().add(Normal));
      const subVector = new PointRep(original.clone().sub(Normal));

      const nearestNeighbor = this._basePoints.findNearest(addVector).point.position;

      if (nearestNeighbor.clone().equals(N[idx][0].position) && nearestNeighbor.clone().equals(N[idx][0].position)) {
        addNormal.addPoint(addVector);
        subNormal.addPoint(subVector);

        addNormal.functionValue[addVector.position.toArray()] = alpha;
        subNormal.functionValue[subVector.position.toArray()] = (-1)*alpha;
        
        idx+=1
      }

      else {
        addNormal = new PointDataStructure();
        subNormal = new PointDataStructure();
        idx=0;
        alpha = alpha/2;
      } 
    }

    return {addNormal, subNormal}
  }
    
}

export default Implicit