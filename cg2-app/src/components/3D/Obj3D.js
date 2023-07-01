import React, { useMemo } from 'react';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MeshBasicMaterial } from "three";
import { AppContext } from '../../context/AppContext';

const Obj3D = ({ obj }) => {

  const {
    wireFrameMode
  } = React.useContext(AppContext);

  const object = useMemo(() => {
    const object = new OBJLoader().parse(obj.text);
    const materialFull = new MeshBasicMaterial({ color: "red", opacity: 0.7, transparent: true });
    const materialWireframe = new MeshBasicMaterial({ color: "red", wireframe: true });

    object.traverse(function (child) {
      if (child.isMesh) {
        child.material = wireFrameMode ? materialWireframe : materialFull;
      }
    });

    return object;
  }, [obj, wireFrameMode]);

  return (
    <primitive object={object} />
  )
}

export default Obj3D;