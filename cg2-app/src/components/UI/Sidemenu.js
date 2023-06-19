import React, { useState } from "react";
import { Checkbox, FormControlLabel, FormLabel, MenuItem, Select, Slider } from "@mui/material";
import { Collapsing, FullWidthFormControl } from "./Containers";
import { Hint, PadlessH1, PadlessH2 } from "./Text";
import T1Controls from "./T1Controls";
import T2Controls from "./T2Controls";

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

const vertexSizeSliderScale = x => (1 / (Math.pow(2, (x - 1)))).toFixed(3);
const vertexSizeDefaultValue = 0;
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

  const dataNames = ["bunny", "cow","cube","cube2","dragon","eight","franke0","franke4",
  "franke5","franke6","franke7","golfball","golfball2","kdtest","sphere","teapot","torus"]

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <PadlessH1>Side Menu</PadlessH1>

      <T1Controls handleDropdownChange={handleDropdownChange} searchSliderMode={searchSliderMode} searchSliderValue={searchSliderValue} handleSliderChange={handleSliderChange} onPointQuery={onPointQuery} displayLines={props.displayLines} setDisplayLines={props.setDisplayLines} onClearSelection={props.onClearSelection} dsDisplayDepth={props.dsDisplayDepth} setDsDisplayDepth={props.setDsDisplayDepth} />

      <T2Controls uSubDiv={props.uSubDiv} setUSubDiv={props.setUSubDiv} vSubDiv={props.vSubDiv} setVSubDiv={props.setVSubDiv} multiplier={props.multiplier} setMultiplier={props.setMultiplier} onComputeSurface={props.onComputeSurface} approximationMethod={props.approximationMethod} setApproximationMethod={props.setApproximationMethod} initiallyOpened wireFrameMode={props.wireFrameMode} setWireFrameMode={props.setWireFrameMode} />


      <Collapsing title={<PadlessH2>Display Controls</PadlessH2>} initiallyOpened>
        {/* FIXME: this is not working 100% */}
        {/* <FullWidthFormControl>
            <FormLabel>Data</FormLabel>
            <Select  value={props.dataName} onChange={(e) => props.setDataName(e.target.value)}>
              {dataNames.map(val => <MenuItem key={val} value={val}>{val}</MenuItem>)}
            </Select>
        </FullWidthFormControl> */}
        <FullWidthFormControl>
          <FormLabel>Vertex Size</FormLabel>
          <Slider
            // value={props.vertexSize}
            onChange={(e) => props.setVertexSize((vertexSizeSliderScale(e.target.value)))}
            valueLabelDisplay="auto"
            defaultValue={vertexSizeDefaultValue}
            step={1}
            min={1}
            max={12}
            scale={vertexSizeSliderScale}
          />
          <FormControlLabel control={<Checkbox checked={props.displayCoords} onChange={(e) => props.setDisplayCoords(e.target.checked)
          } />} label="Show Coordinate System" />
          <FormLabel>PointCloud Implementation</FormLabel>
          <Hint>Select Interactivity for proper point selection</Hint>
          <Select value={props.pointCloudVersion} onChange={(e) => props.setPointCloudVersion(e.target.value)}>
            <MenuItem value={1}>Interactivity (V1)</MenuItem>
            <MenuItem value={2}>Performance (V2)</MenuItem>
          </Select>
        </FullWidthFormControl>
      </Collapsing>
    </div >
  );
}

export default Sidemenu;