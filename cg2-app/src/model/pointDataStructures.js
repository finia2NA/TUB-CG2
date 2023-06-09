import quickselect from "quickselect";
import * as THREE from 'three';


class PointDataStructure {
  toArray() { };
  addPoint(point) { };
  knnSearch(targetPoint, k) { };
  radiusSearch(targetPoint, radius) { };
  includes(point) { };
  getBoundingBox() { };

  // this function should return a way to visualize the data structure.
  // my idea right now would be to return an array of objects representing
  // cubes in case of octree, and planes for kdtree like demonstrated in
  // the exercise sheet
  getRepresentation(depth) { };
}

/**
 * @deprecated because it is not guaranteed to have all features of the KDTree implemented
 */
export class LinearPointDataStructure extends PointDataStructure {
  // example very bad implementation

  constructor(points = []) {
    super();
    this.points = points;
  }

  toArray() {
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

  getBoundingBox() {
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    for (const point of this.points) {
      min.min(point.position);
      max.max(point.position);
    }
    return { min, max };
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

export class KDTreePointDataStructure extends PointDataStructure {

  constructor() {
    super();
    this.points = []; // list of points
    this.faces = []
    this.root = null; // the root of the tree
    this.selfSelection = false; // wether the radius and kn search should include the point itself
    this.treeIsBuilt = false;
    this.text = null
    this.isOBJ = false;
  }

  /**
   * Creates a copy of this data structure, BUT KEEPS THE SAME POINTS, TREE AND FACES
   */
  copy(){
    const copy = new KDTreePointDataStructure();
    copy.points = this.points;
    copy.faces = this.faces;
    copy.root = this.root;
    copy.selfSelection = this.selfSelection;
    copy.treeIsBuilt = this.treeIsBuilt;
    copy.text = this.text;
    copy.isOBJ = this.isOBJ;
    return copy;
  }

  hasNormals() {
    return !!this.points && this.points.length !== 0 && !!this.points[0].normal
  }

  getBoundingBox() {
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    for (const point of this.points) {
      min.min(point.position);
      max.max(point.position);
    }
    return { min, max };
  }

  toArray() {
    return this.points;
  }

  addPoint(point) {
    this.points.push(point);
  }

  clear() {
    this.points = [];
    this.normals = [];
    this.root = null;
    this.selfSelection = false;
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


      const medianIndex = Math.floor(points.length / 2);
      quickselect(points, medianIndex, 0, points.length - 1, (a, b) => a.position.toArray()[axis] - b.position.toArray()[axis]);
      // Find the median point and create a new node with it.
      const median = points[medianIndex];
      const thisNode = new kdTreeNode(median, axis);


      // Recursively build the left and right subtrees.
      thisNode.leftChildren = recur_buildTree(points.slice(0, medianIndex), depth + 1);
      thisNode.rightChildren = recur_buildTree(points.slice(medianIndex + 1), depth + 1);

      // Return the completed node.
      return thisNode;
    }

    const points = this.points.slice();
    this.root = recur_buildTree(points, 0);
    this.treeIsBuilt = true;
  }

  // This function performs a k-nearest neighbor search on a tree data structure
  // It takes a point and a number k as input and returns an array of the k nearest points to the input point

  knnSearch(targetPoint, k) {
    if (!this.treeIsBuilt) throw new Error("Tree is not built yet!");
    // Initialize an empty array to hold the nearest points
    const nearest = [];
    // Define a recursive helper function to search the tree
    const recur_search = (currentNode, depth) => {
      // If the current node is null, we have found a leaf node and can return
      if (currentNode === null) { return; }

      // ---------

      // Determine which axis to compare based on the current depth
      const axis = depth % 3
      // Check if the point is on the left or right side of the current node
      const leftIsCloser = targetPoint.position.toArray()[axis] < currentNode.point.position.toArray()[axis];

      // Define the left and right subtrees based on the point's position relative to the current node
      let closerSubtree = leftIsCloser ? currentNode.leftChildren : currentNode.rightChildren;
      let fartherSubtree = leftIsCloser ? currentNode.rightChildren : currentNode.leftChildren;

      // Recursively search the left subtree
      recur_search(closerSubtree, depth + 1)

      // ------- 

      // If the nearest array is not full, add the current node's point and sort the array by distance to the input point
      if (nearest.length < k) {
        if (this.selfSelection || currentNode.point !== targetPoint) {
          nearest.push(currentNode.point);
        }
        nearest.sort((a, b) => a.distanceTo(targetPoint) - b.distanceTo(targetPoint))
      } else {
        // Otherwise: 
        // Repalce last of array with current node's point if it is closer than the last of array
        const distToCurrentNode = targetPoint.distanceTo(currentNode.point)
        const distToLastOfArray = targetPoint.distanceTo(nearest[nearest.length - 1])
        if (distToCurrentNode < distToLastOfArray) {
          nearest.pop();
          if (this.selfSelection || currentNode.point !== targetPoint) {
            nearest.push(currentNode.point);
          }
          nearest.sort((a, b) => a.distanceTo(targetPoint) - b.distanceTo(targetPoint));
        }
      }

      // -------

      // Calculate the distance between the input point and the current node along the axis being compared
      const distAlongAxis = Math.abs(targetPoint.position.toArray()[axis] - currentNode.point.position.toArray()[axis])

      // Only if the nearest array is not full
      // or the axis distance to the farther subtree is less than the distance to the farthest point in the "nearest" array,
      // recursively search the farther subtree
      if (nearest.length < k || distAlongAxis <= targetPoint.distanceTo(nearest[nearest.length - 1])) {
        recur_search(fartherSubtree, depth + 1)
      }
    }

    // Call the recursive search function on the root node of the tree
    recur_search(this.root, 0)

    // Return the nearest array
    return nearest

  }

  // This function performs a radius search on a tree data structure
  // It takes a point and a radius as input and returns an array of all points within the given radius of the input point

  radiusSearch(targetPoint, radius) {
    if (!this.treeIsBuilt) throw new Error("Tree is not built yet!");
    // Initialize an empty array to hold the nearest points
    const nearest = [];

    // Define a recursive helper function to search the tree
    const recur_search = (node, depth) => {
      // If the current node is null, return
      if (node === null) { return };

      // If the distance between the input point and the current node is less than or equal to the radius, add the current node's point to the nearest array
      if (targetPoint.distanceTo(node.point) <= radius) {
        nearest.push(node.point)
      }

      // Determine which axis to compare based on the current depth
      const axis = depth % 3
      // Check if the point is on the left or right side of the current node
      const leftIsCloser = targetPoint.position.toArray()[axis] < node.point.position.toArray()[axis];

      // Define the left and right subtrees based on the point's position relative to the current node
      let closerSubtree = leftIsCloser ? node.leftChildren : node.rightChildren;
      let fartherSubtree = leftIsCloser ? node.rightChildren : node.leftChildren;

      // Recursively search the left subtree
      recur_search(closerSubtree, depth + 1)

      // Calculate the distance between the input point and the current node along the axis being compared
      const axisDist = Math.abs(targetPoint.position.toArray()[axis] - node.point.position.toArray()[axis])

      // If the axis distance is less than or equal to the radius, there may be matching points in the other subtree too
      // Recursively search the farther subtree too!
      if (axisDist <= radius) {
        recur_search(fartherSubtree, depth + 1)
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

  findNearest(point) {
    if (!this.treeIsBuilt) throw new Error("Tree is not built yet!");
    const recur_search = (node, point, depth = 0, best = null) => {
      if (node === null) { return best };

      const axis = depth % 3
      const next = point.position.toArray()[axis] < node.point.position.toArray()[axis] ? node.leftChildren : node.rightChildren;
      const other = point.position.toArray()[axis] < node.point.position.toArray()[axis] ? node.rightChildren : node.leftChildren;

      const currentDistance = point.distanceTo(node.point);
      const shortest = best ? point.distanceTo(best.point) : Infinity;
      if (currentDistance < shortest) {
        best = node;
      }

      best = recur_search(next, point, depth + 1, best);

      if (Math.abs(point.position.toArray()[axis] - node.point.position.toArray()[axis]) < shortest) {
        best = recur_search(other, point, depth + 1, best);
      }

      return best;
    }

    return recur_search(this.root, point).point;
  }

}

// class OctreePointDataStructure extends PointDataStructure

// class MTreePointDataStructure extends PointDataStructure