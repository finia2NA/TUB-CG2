// PointRep is a class that represents a 3D point in space.
class PointRep {

  constructor(position) {
    this.position = position;
  }

  distanceTo(point) {
    // use pythagoras to calculate distance
    return this.position.distanceTo(point.position)
  }

  distanceToPosition(position) {
    return this.position.distanceTo(position)
  }

}

export default PointRep;