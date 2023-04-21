// a class that represents a cube of an octree by specifying two opposite corners
export class octreeCube {
  constructor(corner1, corner2) {
    this.corner1 = corner1;
    this.corner2 = corner2;
  }

  getVolume() {
    return Math.abs((this.corner1.x - this.corner2.x) * (this.corner1.y - this.corner2.y) * (this.corner1.z - this.corner2.z));
  }
}

// a class that represents a plane of a kdtree by specifying a point. The point must be 0 in all but one dimension.
export class kdTreePlane {
  constructor(point) {
    // tests
    let count = 0;
    for (let key in point) {
      if (point[key] === 0) {
        count++;
      }
    }
    if (count !== 2) {
      throw new Error("kdTreePlane must be initialized with a point that is 0 in all but one dimension");

      this.point = point;
    }
  }
}