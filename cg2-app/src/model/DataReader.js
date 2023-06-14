import PointRep from "./PointRep";
import * as THREE from "three";

/**
 * Reads .off data from local files
 */
class DataReader {
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
    const [vertexCount, faceCount, _] = lines.shift().split(" ").map(Number);
    switch (header) {
      case "OFF":
        for (let i = 0; i < vertexCount; i++) {
          const positionArray = lines.shift().trim().split(" ").map(parseFloat);
          const vector = new THREE.Vector3(...positionArray);
          points.addPoint(new PointRep(vector));
        }
        break;
      case "NOFF":
        for (let i = 0; i < vertexCount; i++) {
          const positionArray = lines.shift().trim().split(" ").map(parseFloat);
          const vector = new THREE.Vector3(...positionArray.slice(0, 3));
          const normalVector = new THREE.Vector3(...positionArray.slice(3));
          points.addPoint(new PointRep(vector));
          points.addNormal([new PointRep(vector), new PointRep(normalVector)]);
        }
        break;
      default:
        throw new Error("Invalid OFF file");
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

export default DataReader;