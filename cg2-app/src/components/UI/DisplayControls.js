import React from "react";
import { Checkbox, FormControlLabel, FormLabel, MenuItem, Select, Slider } from "@mui/material";
import { Collapsing, FullWidthFormControl } from "./Containers";
import { Hint, PadlessH2 } from "./Text";
import { vertexSizeSliderScale, vertexSizeDefaultValue } from "./Sidemenu";
import { AppContext } from "../../context/AppContext";

const DisplayControls = () => {

  const {
    pointCloudVersion, setPointCloudVersion,
    displayCoords, setDisplayCoords,
    vertexSize, setVertexSize,
  } = React.useContext(AppContext);



  return <Collapsing title={<PadlessH2>Display Controls</PadlessH2>} initiallyOpened>
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
        onChange={(e) => setVertexSize((vertexSizeSliderScale(e.target.value)))}
        valueLabelDisplay="auto"
        defaultValue={vertexSizeDefaultValue}
        step={1}
        min={1}
        max={12}
        scale={vertexSizeSliderScale} />
      <FormControlLabel control={<Checkbox checked={displayCoords} onChange={(e) => setDisplayCoords(e.target.checked)} />} label="Show Coordinate System" />
      <FormLabel>PointCloud Implementation</FormLabel>
      <Hint>Select Interactivity for proper point selection</Hint>
      <Select value={pointCloudVersion} onChange={(e) => setPointCloudVersion(e.target.value)}>
        <MenuItem value={1}>Interactivity (V1)</MenuItem>
        <MenuItem value={2}>Performance (V2)</MenuItem>
      </Select>
    </FullWidthFormControl>
  </Collapsing>;
}

export default DisplayControls;