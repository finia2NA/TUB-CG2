class PointDataStructure {
  getAllPoints() { };
  addPoint(point) { };
  knnSearch(point, k) { };
  radiusSearch(point, radius) { };
  includes(point) { };
}

class LinearPointDataStructure extends PointDataStructure {
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