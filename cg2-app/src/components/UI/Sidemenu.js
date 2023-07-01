import React, { useState } from "react";
import { PadlessH1 } from "./Text";
import T1Controls from "./T1Controls";
import T2Controls from "./T2Controls";

import DisplayControls from "./DisplayControls";
import T3Controls from "./T3Controls";

const searchSliderModes = {
  knn: {
    mode: 'knn',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 10,
    sliderText: 'Number of Neighbours',

  },
  radius: {
    mode: 'radius',
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: 0.3,
    sliderText: 'Radius',
  }
}

// TODO: why is this here? (and not in display controls)
export const vertexSizeSliderScale = x => (1 / (Math.pow(2, (x - 1)))).toFixed(3);
export const vertexSizeDefaultValue = 12;
export const defaultVertexSize = vertexSizeSliderScale(vertexSizeDefaultValue);

const Sidemenu = (props) => {

  const [searchSliderMode, setSearchSliderMode] = useState(searchSliderModes.knn);
  const [searchSliderValue, setSearchSliderValue] = useState(searchSliderModes.knn.defaultValue);

  const handleSliderChange = (e) => {
    setSearchSliderValue(e.target.value);
  };

  const handleDropdownChange = (e) => {
    setSearchSliderMode(searchSliderModes[e.target.value]);
    setSearchSliderValue(searchSliderModes[e.target.value].defaultValue);
  };

  const onPointQuery = () => {
    props.onPointQuery(searchSliderMode.mode, searchSliderValue);
  }

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <PadlessH1>Side Menu</PadlessH1>

      <T1Controls handleDropdownChange={handleDropdownChange} searchSliderMode={searchSliderMode} searchSliderValue={searchSliderValue} handleSliderChange={handleSliderChange} onPointQuery={onPointQuery} onClearSelection={props.onClearSelection} />

      <T2Controls onComputeSurface={props.onComputeSurface} />

      <T3Controls onComputeImplicit = {props.onComputeImplicit} />

      <DisplayControls />
    </div >
  );
}

export default Sidemenu;


