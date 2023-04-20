class PointM {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  distanceTo(point) {
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2) + Math.pow(this.z - point.z, 2));
  }
}

export default PointM;