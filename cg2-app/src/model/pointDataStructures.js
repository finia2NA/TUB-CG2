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
class kdTreeNode {
  constructor(point, axis) {

    // construct internal vars
    this.point = point;
    this.axis = axis;

    this.leftChildren = []
    this.rightChildren = []
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
    return this.points.filter(p => p.distanceTo(point) <= radius && p !== point);
  }

  includes(point) {
    return this.points.includes(point);
  }
}

export class KDTreePointDataStructure extends PointDataStructure {

  constructor() {
    super();
    this.points = [];
    this.root = null;
  }

  getAllPoints() {
    return this.points;
  }

  addPoint(point) {
    this.points.push(point);
  }

  buildTree() {
    const recur_buildTree = (points, depth) => {
      if (points.length === 0) { return null; }

      const axis = depth % 3;
      points.sort((a,b) => a.position[axis] - b.position[axis]);
      const index_median = Math.floor(points.length / 2);
      const median = points[index_median];
      const node = new kdTreeNode(median, axis);
      node.leftChildren = recur_buildTree(points.slice(0, index_median), depth + 1 );
      node.rightChildren = recur_buildTree(points.slice(index_median + 1), depth + 1 );
      
      return node;
    }

    this.root = recur_buildTree(this.points, 0);
  }

  knnSearch(point, k) {
    const nearest = [];
    const recur_search = (node, depth) => {
      if (node === null) { return; }

      const axis = depth % 3
      const isLeft = point.position[axis] < node.point.position[axis];
      
      let leftSubtree = isLeft ? node.leftChildren : node.rightChildren ; 
      let rightSubtree = isLeft ? node.rightChildren : node.leftChildren ;
      
      recur_search(leftSubtree, depth + 1) 

      if (nearest.length < k) {
        nearest.push(node.point)
        nearest.sort((a, b) => a.distanceTo(point) - b.distanceTo(point))
      } else {
        const dist1 = point.distanceTo(node.point)
        const dist2 = point.distanceTo(nearest[nearest.length - 1])
        if (dist1 < dist2) {
          nearest.pop();
          nearest.push(node.point);
          nearest.sort((a, b) => a.distanceTo(point) - b.distanceTo(point));
        }
      }

      const axisDist = Math.abs(point.position[axis] - node.point.position[axis])

      if (nearest.length < k || axisDist <= point.distanceTo(nearest[nearest.length - 1])) {
        recur_search(rightSubtree, depth + 1)
      }
    }

    recur_search(this.root, 0)

    return nearest.slice(0, k+1);

  }

  radiusSearch(point, radius) {
    const nearest = [];
    const recur_search = (node, depth) => {
      if (node === null) { return };

      if (point.distanceTo(node.point) <= radius) {
        nearest.push(node.point)
      }

      const axis = depth % 3
      const isLeft = point.position[axis] < node.point.position[axis];

      let leftSubtree = isLeft ? node.leftChildren : node.rightChildren ; 
      let rightSubtree = isLeft ? node.rightChildren : node.leftChildren ;
      
      recur_search(leftSubtree, depth + 1) 

      const axisDist = Math.abs(point.position[axis] - node.point.position[axis])
      
      if (axisDist <= radius) {
        recur_search(rightSubtree, depth + 1)
      }
    }

    recur_search(this.root, 0)

    return nearest;
  }

  includes(point) {
    return this.points.includes(point);
  }

}

// class OctreePointDataStructure extends PointDataStructure

// class MTreePointDataStructure extends PointDataStructure