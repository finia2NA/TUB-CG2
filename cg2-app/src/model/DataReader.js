import PointRep from "./PointRep";
import * as THREE from "three";
import { Vector3 } from "three";
import Face from "./Face";
const OBJFile = require('obj-file-parser');

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
      "data/" + this.baseName.replace(/\s+/g, "").toLowerCase();
    const content = await fetch(fileName).then((x) => x.text());
    points.text = content;



    if (fileName.includes('obj')) {
      return this.readOBJ(content, points);
    }
    else {
      return this.readOFF(content, points);
    }
  }

  readOBJ(content, pointsDS) {
    // read file
    const objFile = new OBJFile(content);
    objFile.parse()
    if (objFile.result.models.length !== 1) throw new Error("Invalid OBJ file");

    const model = objFile.result.models[0];

    // load vertices
    const points = model.vertices.map((vertex, index) => {
      const point = new PointRep(new Vector3(vertex.x, vertex.y, vertex.z))
      point.index = index;
      return point;
    });

    const faces = model.faces.map((faceOBJ, index) => {
      const indices = faceOBJ.vertices.map(v => v.vertexIndex - 1); // -1 because obj is 1-indexed for some reason
      const triagPoints = indices.map(index => points[index]);
      const face = new Face(triagPoints, indices, index);

      // associate points with face
      triagPoints.forEach(point => point.faces.push(face));
      return face;
    });

    // write to DS and return
    pointsDS.points = points;
    pointsDS.faces = faces;

    pointsDS.buildTree();

    pointsDS.isOBJ = true;
    return pointsDS;
  }




  readOFF(content, points) {
    // check header
    const lines = content.split("\n");

    const header = lines.shift().trim();
    const [vertexCount, faceCount, _] = lines.shift().split(" ").map(Number);
    switch (header) {
      case "OFF":
        for (let i = 0; i < vertexCount; i++) {
          let positionArray = lines.shift().trim().split(" ").map(parseFloat);
          if (this.switchAxis) {
            positionArray = rotate(positionArray);
          }
          const position = new Vector3(...positionArray);

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
          const position = new Vector3(...pointDataArray.slice(0, 3));
          const normal = new Vector3(...pointDataArray.slice(3));
          points.addPoint(new PointRep(position, normal));
        }
        break;
      default:
        throw new Error("Invalid OFF file");
    }

    return points;
  }
}

export default DataReader;