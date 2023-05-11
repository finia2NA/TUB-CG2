import { Points } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

const getColorArray = (coloring, length) => {
  const colors = {
    "vanilla": [1, 1, 0],
    "highlighted": [0, 0, 1],
    "selected": [1, 0, 0],
    "hovered": [1, 0, 0]

  }
  const nativeArray = Array(length).fill(colors[coloring]).flat()

  return new Float32Array(nativeArray)

}


const SubPointCloud2 = (props) => {

  const myBoundingRect = document.getElementById("canvas").getBoundingClientRect()

  const { scene, camera } = useThree()
  // Create a custom raycaster
  const raycaster = new THREE.Raycaster();

  const vertexSize = props.vertexSize ? props.vertexSize : 0.01
  // const vertexSize = (desiredSize / window.innerHeight) * 2 * Math.tan(Math.PI * camera.fov / 360);
  const positions = props.points.map(p => p.position)

  // Listen for click events on the document
  document.addEventListener('click', onClick);

  function onClick(event) {
    // FIXME: deal with the too-large radius of points that are detected as hits

    // Calculate the mouse position in normalized device coordinates
    const mouse = new THREE.Vector2();

    mouse.x = ((event.clientX - myBoundingRect.left) / myBoundingRect.width) * 2 - 1;
    mouse.y = - ((event.clientY - myBoundingRect.top) / myBoundingRect.height) * 2 + 1;
    if (mouse.x < -1 || mouse.x > 1 || mouse.y < -1 || mouse.y > 1) return

    // Set the raycaster's origin and direction based on the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Find all intersected objects
    const intersects = raycaster.intersectObjects(scene.children);
    const hits = intersects.filter(p => p.distanceToRay < vertexSize)

    hits.sort((a, b) => a.distanceToRay - b.distanceToRay)

    if (hits.length === 0) return

    const eventArray = hits[0].object.geometry.attributes.position.array
    const pointPosition = new THREE.Vector3(
      eventArray[hits[0].index * 3],
      eventArray[hits[0].index * 3 + 1],
      eventArray[hits[0].index * 3 + 2]
    )
    props.handlePointClick(pointPosition)
  }


  const positionsBuffer = new Float32Array(positions.length * 3);

  positions.forEach((position, index) => {
    positionsBuffer[index * 3 + 0] = position.x;
    positionsBuffer[index * 3 + 1] = position.y;
    positionsBuffer[index * 3 + 2] = position.z;
  });

  // fill the colors buffer with white
  const colorsBuffer = getColorArray(props.coloring, positions.length);

  // fill the sizes buffer with 0.1
  const sizesBuffer = new Float32Array(positions.length).fill(vertexSize);

  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    void main() {
      float dist = length(gl_PointCoord.xy - vec2(0.5));
      if (dist > 0.5) discard;
      gl_FragColor = vec4(vColor, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader,
    fragmentShader,
  });

  console.log("rendering subcloud " + props.coloring)

  return (
    <Points
      positions={positionsBuffer}
      colors={colorsBuffer}
      sizes={sizesBuffer}
      material={material}
    />
  );
};

export default SubPointCloud2;