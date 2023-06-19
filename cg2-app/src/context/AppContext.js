import React, { useState } from 'react';
import { defaultVertexSize } from '../components/UI/Sidemenu';

export const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  // Model to load
  const [dataName, setDataName] = useState("cat");
  const [rotateModel, setRotateModel] = useState(false); // WIP

  // Display Control State
  const [dsDisplayDepth, setDsDisplayDepth] = useState(0);
  const [pointCloudVersion, setPointCloudVersion] = useState(2)
  const [displayLines, setDisplayLines] = useState(false);
  const [displayCoords, setDisplayCoords] = useState(false);
  const [vertexSize, setVertexSize] = useState(defaultVertexSize);

  const [wireFrameMode, setWireFrameMode] = useState(false);

  const [approximationMethod, setApproximationMethod] = useState("btps");
  const [uSubDiv, setUSubDiv] = useState(10);
  const [vSubDiv, setVSubDiv] = useState(10);
  const [subDivMultiplier, setMultiplier] = useState(3);

  return (
    <AppContext.Provider value={{
      dataName, setDataName,
      rotateModel, setRotateModel,
      dsDisplayDepth, setDsDisplayDepth,
      pointCloudVersion, setPointCloudVersion,
      displayLines, setDisplayLines,
      displayCoords, setDisplayCoords,
      vertexSize, setVertexSize,
      wireFrameMode, setWireFrameMode,
      approximationMethod, setApproximationMethod,
      uSubDiv, setUSubDiv,
      vSubDiv, setVSubDiv,
      subDivMultiplier, setMultiplier,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;