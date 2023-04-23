// https://threejs.org/docs/#api/en/geometries/WireframeGeometry


import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three';


const Cuboid3D = (props) => {

  const obj = useLoader(OBJLoader, '/wireframeCube.obj')

  let position = props.representation.position
  for (let i = 0; i < position.length; i++) {
    position[i] = position[i] + props.representation.dimensions[i] / 2
  }


  const scale = props.representation.dimensions

  return <primitive object={obj} position={position} scale={scale} />

}

export default Cuboid3D