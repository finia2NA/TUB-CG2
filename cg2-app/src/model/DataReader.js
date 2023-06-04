import PointRep from "./PointRep";
import * as THREE from "three";

/**
 * Reads .off data from local files
 */
export class DataReader {
  constructor(baseName) {
    this.baseName = baseName;
  }

  async read_file(points) {
    // read content
    const fileName =
      "data/" + this.baseName.replace(/\s+/g, "").toLowerCase() + ".off";
    const content = await fetch(fileName).then((x) => x.text());
    const lines = content.split("\n");

    // check header
    const header = lines.shift().trim();
    if (header !== "OFF") {
      console.error("Invalid OFF file");
      return;
    }

    // read vertices

    // The first line afther the header contains the number of vertices, faces and edges.
    // We will just be iterating over the vertices.
    const [vertexCount, faceCount, _] = lines.shift().split(" ").map(Number);

    // an OFF is just a list of points, so we can simply read each line and add a representation of it to the array to be filled
    for (let i = 0; i < vertexCount; i++) {
      const positionArray = lines.shift().trim().split(" ").map(parseFloat);
      const vector = new THREE.Vector3(...positionArray);
      points.addPoint(new PointRep(vector));
    }

    return points

    // read faces
    // for (let i = 0; i < faceCount; i++) {
    //   const face = lines.shift().split(" ").map(parseFloat);
    //   this.faces.push(face);
    // }
  }
}

// export default DataReader;

export class NormalDataReader {
  constructor(baseName) {
    this.baseName = baseName;
  }

  async read_file(points) {
    // read content
    const fileName =
      "data/" + this.baseName.replace(/\s+/g, "").toLowerCase() + ".off";
    const content = await fetch(fileName).then((x) => x.text());
    const lines = content.split("\n");

    // check header
    const header = lines.shift().trim();
    if (header !== "NOFF") {
      console.error("Invalid Normal OFF file");
      return;
    }

    // read vertices

    // The first line afther the header contains the number of vertices, faces and edges.
    // We will just be iterating over the vertices.
    const [vertexCount, faceCount, _] = lines.shift().split(" ").map(Number);

    // an OFF is just a list of points, so we can simply read each line and add a representation of it to the array to be filled
    for (let i = 0; i < vertexCount; i++) {
      const positionArray = lines.shift().trim().split(" ").map(parseFloat);
      const vector = new THREE.Vector3(...positionArray.slice(0,3));
      const normalVector = new THREE.Vector3(...positionArray.slice(3));
      points.addPoint(new PointRep(vector));
      points.addNormal([new PointRep(vector), new PointRep(normalVector)]);
    }

    return points

    // read faces
    // for (let i = 0; i < faceCount; i++) {
    //   const face = lines.shift().split(" ").map(parseFloat);
    //   this.faces.push(face);
    // }
  }
}
