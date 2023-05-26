import { Vector2, Vector3 } from "three";

// PointRep is a class that represents a 3D point in space.
class PointRep {

  constructor(position) {
    if (!(position instanceof Vector3))
      throw new Error("PointRep constructor expects a Vector3 as parameter");

    this.position = position;
  }

  distanceTo(point) {
    // use pythagoras to calculate distance
    return this.position.distanceTo(point.position)
  }

  distanceToPosition(position) {
    return this.position.distanceTo(position)
  }

  distance2DTo(point, axises) {
    const this2D = new Vector2(this.position.getComponent(axises[0]), this.position.getComponent(axises[1]));
    const point2D = new Vector2(point.position.getComponent(axises[0]), point.position.getComponent(axises[1]));
    return this2D.distanceTo(point2D);
  }

  distance2DToPosition(position, axises = [0, 1]) {
    if (position instanceof Vector3) {
      const this2D = new Vector2(this.position.getComponent(axises[0]), this.position.getComponent(axises[1]));
      const position2D = new Vector2(position.getComponent(axises[0]), position.getComponent(axises[1]));
      return this2D.distanceTo(position2D);
    } else if (position instanceof Vector2) {
      const this2D = new Vector2(this.position.getComponent(axises[0]), this.position.getComponent(axises[1]));
      return this2D.distanceTo(position);
    }
  }
}

export default PointRep;

export class SampledPointRep extends PointRep {

  constructor(position, surfaceNormal = null, exactNormal = null, u = null, v = null,) {
    super(position);
    this.surfaceNormal = surfaceNormal;
    this.exactNormal = exactNormal;

    // I don't know if having the U and V values in the point rep. is necessary,
    // but it might be useful for some things, so let's store them.
    this.u = u;
    this.v = v;
  }

}