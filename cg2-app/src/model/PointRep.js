import { Vector2, Vector3 } from "three";
// https://threejs.org/docs/#api/en/math/Vector3

// PointRep is a class that represents a 3D point in space.
class PointRep {

  constructor(position, normal = null) {
    if (!(position instanceof Vector3))
      throw new Error("PointRep constructor expects a Vector3 as parameter");

    this.position = position;

    if (normal && Math.abs(normal.length() - 1) > 0.001) {
      console.warn(`Encountered non-unitary normal in Pointrep. Length was: ${normal.length()}. Normalizing...`)
      this.normal = normal.normalize();
    } else {
      this.normal = normal;
    }

    // This is used for Poisson Surface Reconstruction.
    // Default value is 0, for the original (non-offset) point set
    this.functionValue = 0
  }

  distanceTo(point) {
    // use pythagoras to calculate distance
    return this.position.distanceTo(point.position)
  }

  distanceToPosition(position) {
    return this.position.distanceTo(position)
  }

  /**
   * Returns distance to point in 2D space.
   * @param {Vector3} point
   * @param {number[]} axises
   * @return {number}
   */
  distance2DTo(point, axises) {
    const this2D = new Vector2(this.position.getComponent(axises[0]), this.position.getComponent(axises[1]));
    const point2D = new Vector2(point.position.getComponent(axises[0]), point.position.getComponent(axises[1]));
    return this2D.distanceTo(point2D);
  }

  /**
   * Returns the 2d distance between this point and another position.
   * @param {Vector3 | Vector2} position
   * @param {number[]} axises
   * @returns {number}
   */
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

/**
 * @deprecated, use the optional parameters of the PointRep constructor instead
 */
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