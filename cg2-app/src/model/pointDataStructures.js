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
    let distances = [];
    let points = this.points;
    for (let i = 0; i < points.length; i++) {
      distances.push([points[i], points[i].distanceTo(point)]);
    }
    distances.sort((a, b) => a[1] - b[1]);
    return distances.slice(0, k);
  }

  radiusSearch(point, radius) {
    let distances = [];
    let points = this.points;
    for (let i = 0; i < points.length; i++) {
      let distance = points[i].distanceTo(point);
      if (distance <= radius) {
        distances.push([points[i], distance]);
      }
    }
    return distances;
  }

  includes(point) {
    return this.points.includes(point);
  }
}

// class KDTreePointDataStructure extends PointDataStructure

// class OctreePointDataStructure extends PointDataStructure

// class MTreePointDataStructure extends PointDataStructure