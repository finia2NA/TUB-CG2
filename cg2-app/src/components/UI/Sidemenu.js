<<<<<<< Updated upstream
import { useState } from "react";
import { Checkbox, FormControl, FormControlLabel, FormLabel, MenuItem, Select, Slider } from "@mui/material";
import { Collapsing, FullWidthFormControl, H3Wrapper } from "./Containers";
import { Button } from "./Button";
import { Hint, PadlessH1, PadlessH2, PadlessH3 } from "./Text";
=======
import React, { useState } from "react";
import { Checkbox, FormControlLabel, FormLabel, MenuItem, Select, Slider } from "@mui/material";
import { Collapsing, FullWidthFormControl } from "./Containers";
import { Hint, PadlessH1, PadlessH2 } from "./Text";
import T1Controls from "./T1Controls";
import T2Controls from "./T2Controls";
>>>>>>> Stashed changes

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
      <Collapsing title={<PadlessH2>Task 1: KDTree</PadlessH2>} style={{ display: "flex", flexDirection: "column" }}>
        <H3Wrapper>
          <PadlessH3>Gather Controls</PadlessH3>
          <FullWidthFormControl>
            <FormLabel>Slider Mode</FormLabel>
            <Select defaultValue={"knn"} onChange={handleDropdownChange}>
              <MenuItem value={"knn"}>K-nearest-neighbour</MenuItem>
              <MenuItem value={"radius"}>Radius</MenuItem>
            </Select>
            <FormLabel>{searchSliderMode.sliderText}</FormLabel>
            <Slider
              value={searchSliderValue}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              step={searchSliderMode.step}
              min={searchSliderMode.min}
              max={searchSliderMode.max}
            />
            <Button variant="contained" color="primary" onClick={onPointQuery}>Gather</Button>
          </FullWidthFormControl>
        </H3Wrapper>
        <H3Wrapper>
          <PadlessH3>Selection Controls</PadlessH3>
          <FormControl>
            <Hint>Click on a point while holding shift to select it</Hint>
            <Button variant="contained" color="warning" onClick={props.onClearSelection}>Clear Selection</Button>
          </FormControl>
        </H3Wrapper>
        <H3Wrapper>
          <PadlessH3>Display Controls</PadlessH3>
          <FormControlLabel control={<Checkbox checked={props.displayLines} onChange={(e) => props.setDisplayLines(e.target.checked)
          } />} label="Show Connections" />

          <FullWidthFormControl>
            <FormLabel>Datastructure Display Depth</FormLabel>
            <Slider
              value={props.dsDisplayDepth}
              onChange={(e) => props.setDsDisplayDepth(e.target.value)}
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={8}
            />
          </FullWidthFormControl>
        </H3Wrapper>
      </Collapsing>

      <Collapsing title={<PadlessH2>Task 2: Surfaces</PadlessH2>} initiallyOpened>
      </Collapsing>

      <Collapsing title={<PadlessH2>Display Controls</PadlessH2>} initiallyOpened>
        <FullWidthFormControl>
          <FormLabel>Vertex Size</FormLabel>
          <Slider
            // value={props.vertexSize}
            onChange={(e) => props.setVertexSize((vertexSizeSliderScale(e.target.value)))}
            valueLabelDisplay="auto"
            defaultValue={4}
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