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
export class kdTreeNode {
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

  constructor(points = []) {
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

  // This function builds a 3-dimensional kd-tree recursively.
  // It takes in an array of points and the depth of the current node.
  // It returns the root node of the kd-tree.

  buildTree() {
    // This is the recursive function that actually builds the kd-tree.
    const recur_buildTree = (points, depth) => {
      // If there are no points left, return null.
      if (points.length === 0) { return null; }

      // Determine which axis to split on based on the depth.
      const axis = depth % 3;

      // Sort the points by their position along the current axis.
      points.sort((a, b) => a.position.toArray()[axis] - b.position.toArray()[axis]);

      // Find the median point and create a new node with it.
      const medianIndex = Math.floor(points.length / 2);
      const median = points[medianIndex];
      const node = new kdTreeNode(median, axis);

      // Recursively build the left and right subtrees.
      node.leftChildren = recur_buildTree(points.slice(0, medianIndex), depth + 1);
      node.rightChildren = recur_buildTree(points.slice(medianIndex + 1), depth + 1);

      // Return the completed node.
      return node;
    }

    this.root = recur_buildTree(this.points, 0);
  }

  // This function performs a k-nearest neighbor search on a tree data structure
  // It takes a point and a number k as input and returns an array of the k nearest points to the input point

  knnSearch(point, k) {
    // Initialize an empty array to hold the nearest points
    const nearest = [];
    // Define a recursive helper function to search the tree
    const recur_search = (node, depth) => {
      // If the current node is null, return
      if (node === null) { return; }

      // Determine which axis to compare based on the current depth
      const axis = depth % 3
      // Check if the point is on the left or right side of the current node
      const isLeft = point.position.toArray()[axis] < node.point.position.toArray()[axis];

      // Define the left and right subtrees based on the point's position relative to the current node
      let leftSubtree = isLeft ? node.leftChildren : node.rightChildren;
      let rightSubtree = isLeft ? node.rightChildren : node.leftChildren;

      // Recursively search the left subtree
      recur_search(leftSubtree, depth + 1)

      // If the nearest array is not full, add the current node's point and sort the array by distance to the input point
      if (nearest.length < k) {
        nearest.push(node.point)
        nearest.sort((a, b) => a.distanceTo(point) - b.distanceTo(point))
      } else {
        // Otherwise, compare the distance between the input point and the current node to the distance between the input point and the farthest point in the nearest array
        const dist1 = point.distanceTo(node.point)
        const dist2 = point.distanceTo(nearest[nearest.length - 1])
        // If the current node is closer, replace the farthest point in the nearest array with the current node's point and sort the array by distance to the input point
        if (dist1 < dist2) {
          nearest.pop();
          nearest.push(node.point);
          nearest.sort((a, b) => a.distanceTo(point) - b.distanceTo(point));
        }
      }

      // Calculate the distance between the input point and the current node along the axis being compared
      const axisDist = Math.abs(point.position.toArray()[axis] - node.point.position.toArray()[axis])

      // If the nearest array is not full or the axis distance is less than the distance to the farthest point in the nearest array, recursively search the right subtree
      if (nearest.length < k || axisDist <= point.distanceTo(nearest[nearest.length - 1])) {
        recur_search(rightSubtree, depth + 1)
      }
    }

    // Call the recursive search function on the root node of the tree
    recur_search(this.root, 0)

    // Return the k nearest points
    return nearest.slice(0, k + 1);

  }

  // This function performs a radius search on a tree data structure
  // It takes a point and a radius as input and returns an array of all points within the given radius of the input point

  radiusSearch(point, radius) {
    // Initialize an empty array to hold the nearest points
    const nearest = [];
    // Define a recursive helper function to search the tree
    const recur_search = (node, depth) => {
      // If the current node is null, return
      if (node === null) { return };

      // If the distance between the input point and the current node is less than or equal to the radius, add the current node's point to the nearest array
      if (point.distanceTo(node.point) <= radius) {
        nearest.push(node.point)
      }

      // Determine which axis to compare based on the current depth
      const axis = depth % 3
      // Check if the point is on the left or right side of the current node
      const isLeft = point.position.toArray()[axis] < node.point.position.toArray()[axis];

      // Define the left and right subtrees based on the point's position relative to the current node
      let leftSubtree = isLeft ? node.leftChildren : node.rightChildren;
      let rightSubtree = isLeft ? node.rightChildren : node.leftChildren;

      // Recursively search the left subtree
      recur_search(leftSubtree, depth + 1)

      // Calculate the distance between the input point and the current node along the axis being compared
      const axisDist = Math.abs(point.position.toArray()[axis] - node.point.position.toArray()[axis])

      // If the axis distance is less than or equal to the radius, recursively search the right subtree
      if (axisDist <= radius) {
        recur_search(rightSubtree, depth + 1)
      }
    }

    // Call the recursive search function on the root node of the tree
    recur_search(this.root, 0)

    // Return the array of points within the given radius of the input point
    return nearest;
  }

  includes(point) {
    return this.points.includes(point);
  }

}

// class OctreePointDataStructure extends PointDataStructure

// class MTreePointDataStructure extends PointDataStructure