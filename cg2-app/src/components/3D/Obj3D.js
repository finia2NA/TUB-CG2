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
    const materialFull = new MeshBasicMaterial({ color: "red", opacity: 0.3, transparent: true });
    const materialWireframe = new MeshBasicMaterial({ color: "red", wireframe: true });

    object.traverse(function (child) {
      if (child.isMesh) {
        child.material = true ? materialWireframe : materialFull; // here, wireframe mode =false could be used to display the obj's faces, but we don't want that for S4 so I just hardcoded it to wireframe rn
      }
    });

    return object;
  }, [obj, wireFrameMode]);

  return (
    <primitive object={object} />
  )
}

export default Obj3D;