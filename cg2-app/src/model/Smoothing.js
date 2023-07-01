import { Vector3 } from "three";

export const computeNormals = (pointDS) => {
  const points = pointDS.points;
  for (const point of points) {
    const weights = point.faces.map(face => face.area);
    const normals = point.faces.map(face => face.normal);
    const normal = new Vector3()
    for (let i = 0; i < weights.length; i++) {
      normal.addScaledVector(normals[i], weights[i]);
    }
    normal.normalize();
    point.normal = normal;
  }
}