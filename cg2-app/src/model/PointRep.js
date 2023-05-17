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

export class SampledPointRep extends PointRep {

  constructor(position, u = null, v = null, surfaceNormal = null, exactNormal = null) {
    super(position);
    this.surfaceNormal = surfaceNormal;
    this.exactNormal = exactNormal;

    // I don't know if having the U and V values in the point rep. is necessary,
    // but it might be useful for some things, so let's store them.
    this.u = u;
    this.v = v;
  }

}