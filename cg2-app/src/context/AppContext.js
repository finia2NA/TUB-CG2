import React, { useState } from 'react';
import { defaultVertexSize } from '../components/UI/Sidemenu';
import { implicitAlphaDefault, implicitBasisFunctionDefault, implicitDimDefault, wendlandRadiusDefault } from '../components/UI/T3Controls';

export const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  // Model to load
  const [dataName, setDataName] = useState("shapes/eight.obj");
  const [rotateModel, setRotateModel] = useState(false); // WIP

  // Display Control State
  const [dsDisplayDepth, setDsDisplayDepth] = useState(0);
  const [pointCloudVersion, setPointCloudVersion] = useState(2)
  const [displayLines, setDisplayLines] = useState(false);
  const [displayCoords, setDisplayCoords] = useState(false);
  const [vertexSize, setVertexSize] = useState(defaultVertexSize);

  const [wireFrameMode, setWireFrameMode] = useState(true);

  const [approximationMethod, setApproximationMethod] = useState("btps");
  const [uSubDiv, setUSubDiv] = useState(10);
  const [vSubDiv, setVSubDiv] = useState(10);
  const [subDivMultiplier, setMultiplier] = useState(3);

  const [implicitDim, setImplicitDim] = useState([implicitDimDefault, implicitDimDefault, implicitDimDefault]);
  const [implicitAlpha, setImplicitAlpha] = useState(implicitAlphaDefault);
  const [implicitDegree, setImplicitDegree] = useState(implicitBasisFunctionDefault);
  const [wendlandRadius, setWendlandRadius] = useState(wendlandRadiusDefault);
  const [hasNormals, setHasNormals] = useState(false);

  const [smoothingMethod, setSmoothingMethod] = useState("laplace");
  const [smoothingSteps, setSmoothingSteps] = useState(1);
  const [smoothingLambda, setSmoothingLambda] = useState(0.05);

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
      implicitDim, setImplicitDim,
      implicitAlpha, setImplicitAlpha,
      implicitDegree, setImplicitDegree,
      wendlandRadius, setWendlandRadius,
      hasNormals, setHasNormals,
      smoothingMethod, setSmoothingMethod,
      smoothingSteps, setSmoothingSteps,
      smoothingLambda, setSmoothingLambda,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;