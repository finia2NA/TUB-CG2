// a class that represents a cube of an octree by specifying two opposite corners
class octreeCube {
  constructor(corner1, corner2) {
    this.corner1 = corner1;
    this.corner2 = corner2;
    this.children = []
  }

  getVolume() {
    return Math.abs((this.corner1.x - this.corner2.x) * (this.corner1.y - this.corner2.y) * (this.corner1.z - this.corner2.z));
  }
}

// a class that represents a plane of a kdtree by specifying a point and an axis.
// Axis is a vector with all zeros and one one
class kdTreePlane {
  constructor(point, axis) {
    // testsing that axis is valid
    let count0 = 0;
    let count1 = 0
    for (let key in axis) {
      if (point[key] === 0) {
        count0++;
      }
      if (point[key] === 1) {
        count1++
      }
    }
    if (!(count0 === axis.length - 1 && count1 === 1)) {
      throw new Error("invalid kdTree parameters")
    }


    // construct internal vars
    this.point = point;
    this.axis = axis;

    this.lesserChildren = []
    this.higherChildren = []



  }
}

class PointDataStructure {
  getAllPoints() { };
  addPoint(point) { };
  knnSearch(point, k) { };
  radiusSearch(point, radius) { };
  includes(point) { };

  // this function should return a way to visualize the data structure.
  // my idea right now would be to return an array of objects representing
  // cubes in case of octree, and planes for kdtree like demonstrated in
  // the exercise sheet
  getRepresentation(depth) { };
}

export class LinearPointDataStructure extends PointDataStructure {
  // example very bad implementation

  constructor() {
    super();
    this.points = [];
  }

  getAllPoints() {
    return this.points;
  }

  addPoint(point) {
    this.points.push(point);
  }

  knnSearch(point, k) {
    const copy = [...this.points].filter(p => p !== point); // we don't want to include the point itself
    copy.sort((a, b) => a.distanceTo(point) - b.distanceTo(point));
    return copy.slice(0, k);
  }

  radiusSearch(point, radius) {
    throw new Error("not implemented");
  }

  includes(point) {
    return this.points.includes(point);
  }
}

// class KDTreePointDataStructure extends PointDataStructure

// class OctreePointDataStructure extends PointDataStructure

// class MTreePointDataStructure extends PointDataStructure