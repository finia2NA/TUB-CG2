import { Vector3 } from 'three';

class Face {
  constructor(points, indices, index) {
    this.points = points
    this.index = index
    this.indices = indices

    const [a, b, c] = points.map(p => p.position)

    // Calculate normal and area
    const edge1 = new Vector3().subVectors(b, a);
    const edge2 = new Vector3().subVectors(c, a);
    this.normal = new Vector3().crossVectors(edge1, edge2).normalize();
    this.area = new Vector3().crossVectors(edge1, edge2).length()/2;
  }

}


export default Face