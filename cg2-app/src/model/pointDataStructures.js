// a class that represents a cube of an octree by specifying two opposite corners
class octreeCube {
  constructor(position, dimensions) {
    this.position = position;
    this.dimensions = dimensions;
    this.children = []
  }

  getVolume() {
    return this.dimensions[0] * this.dimensions[1] * this.dimensions[2];
  }
}

// a class that represents a plane of a kdtree by specifying a point and an axis.
// Axis is the # of the dimension that the plane is on.
class kdTreePlane {
  constructor(point, axis) {


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

  constructor(points=[]) {
    super();
    this.points = points;
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
    return this.points.filter(p => p.distanceTo(point) <= radius && p !== point);
  }

  includes(point) {
    return this.points.includes(point);
  }
}

// class KDTreePointDataStructure extends PointDataStructure

// class OctreePointDataStructure extends PointDataStructure

// class MTreePointDataStructure extends PointDataStructure