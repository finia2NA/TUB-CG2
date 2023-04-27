import PointRep from "./PointRep";

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
    if (header !== "OFF") {
      console.error("Invalid OFF file");
      return;
    }

    // read vertices
    const [vertexCount, faceCount, _] = lines.shift().split(" ").map(Number);
    for (let i = 0; i < vertexCount; i++) {
      const vertex = lines.shift().split(" ").map(parseFloat);
      points.addPoint(new PointRep(vertex));
    }
    
    return points

    // read faces
    // for (let i = 0; i < faceCount; i++) {
    //   const face = lines.shift().split(" ").map(parseFloat);
    //   this.faces.push(face);
    // }
  }
}

export default DataReader;
