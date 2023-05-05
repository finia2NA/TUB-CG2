// PointRep is a class that represents a 3D point in space.
class PointRep {

  constructor(position) {
    this.position = position;
  }

  distanceTo(point) {
    // use pythagoras to calculate distance
    const x = this.position[0] - point.position[0];
    const y = this.position[1] - point.position[1];
    const z = this.position[2] - point.position[2];

    return Math.sqrt(x * x + y * y + z * z);
  }
}

export default PointRep;