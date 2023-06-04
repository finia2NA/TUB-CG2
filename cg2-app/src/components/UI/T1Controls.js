import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, MenuItem, Select, Slider } from "@mui/material"
import { Collapsing, FullWidthFormControl, H3Wrapper } from "./Containers"
import { Hint, PadlessH2, PadlessH3 } from "./Text"
import React from 'react';

const T1Controls = ({ handleDropdownChange, searchSliderMode, searchSliderValue, handleSliderChange, onPointQuery, displayLines, setDisplayLines, onClearSelection, dsDisplayDepth, setDsDisplayDepth }) => {
  return (
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
          <Button variant="contained" color="warning" onClick={onClearSelection}>Clear Selection</Button>
        </FormControl>
      </H3Wrapper>
      <H3Wrapper>
        <PadlessH3>Display Controls</PadlessH3>
        <FormControlLabel control={<Checkbox checked={displayLines} onChange={(e) => setDisplayLines(e.target.checked)
        } />} label="Show Connections" />

        <FullWidthFormControl>
          <FormLabel>Datastructure Display Depth</FormLabel>
          <Slider
            value={dsDisplayDepth}
            onChange={(e) => setDsDisplayDepth(e.target.value)}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
          />
        </FullWidthFormControl>
      </H3Wrapper>
    </Collapsing>
  )
}

export default T1Controls