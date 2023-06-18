import PointRep from "./PointRep";
import * as THREE from "three";

function rotate(arr) {
  if (arr.length < 3) {
    return 'Array should have at least three elements';
  } else {
    const oldY = arr[1];
    const oldZ = arr[2];
    arr[1] = oldZ;
    arr[2] = -oldY;

  }
}

/**
 * Reads .off data from local files
 */
class DataReader {
  constructor(baseName, switchAxis) {
    this.baseName = baseName;
    this.switchAxis = switchAxis;
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
          let positionArray = lines.shift().trim().split(" ").map(parseFloat);
          if (this.switchAxis) {
            positionArray = rotate(positionArray);
          }
          const position = new THREE.Vector3(...positionArray);

          points.addPoint(new PointRep(position));
        }
        break;
      case "NOFF":
        for (let i = 0; i < vertexCount; i++) {
          const pointDataArray = lines.shift().trim().split(" ").map(parseFloat);
          let positionArray = pointDataArray.slice(0, 3);
          let normalArray = pointDataArray.slice(3);
          if (this.switchAxis) {
            positionArray = rotate(positionArray);
            normalArray = rotate(normalArray);
          }
          const position = new THREE.Vector3(...pointDataArray.slice(0, 3));
          const normal = new THREE.Vector3(...pointDataArray.slice(3));
          points.addPoint(new PointRep(position, normal));
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