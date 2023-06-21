import { DoubleSide, Vector3 } from "three";
import * as THREE from "three";
import PointRep from "../../model/PointRep";
import Line3D from "./Line3D";
import React, { useMemo } from "react";


const MarchingCube3D = ({ surfacePointsMC = [], wireFrameMode = true }) => {

  const geometry = useMemo(() => {

    // if empty    
    if (surfacePointsMC.length === 0) return;
 
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(surfacePointsMC.length* 3);
    for (let i=0;i<surfacePointsMC.length;i++){
      vertices[3*i] = surfacePointsMC[i].position.x
      vertices[3*i+1] = surfacePointsMC[i].position.y
      vertices[3*i+2]= surfacePointsMC[i].position.z
    }    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  
    

    return geometry
  }, [surfacePointsMC])

  const normalCoords = useMemo(() => {
    const normalCoords = []
    for (let i = 0; i < surfacePointsMC.length; i++) {
        if (surfacePointsMC[i].normal) {
          const point = surfacePointsMC[i];
          const start = point.position;
          const end = point.position.clone().add(point.normal.clone().multiplyScalar(0.1));
          normalCoords.push({ start, end })
      }
    }
    return normalCoords;
  }, [surfacePointsMC])


  return (
    <>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="violet" transparent opacity={0.5} side={DoubleSide} depthTest={false} wireframe={wireFrameMode} />
      </mesh>
      {normalCoords.length !== 0 && normalCoords.map((normalCoord, i) => {
        return (
          <Line3D key={i} start={normalCoord.start} end={normalCoord.end} color="orange" />
        )
      }
      )}
    </>

  )
}

export default MarchingCube3D;