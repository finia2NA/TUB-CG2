import { Button, Checkbox, FormControlLabel, FormLabel, MenuItem, Select, Slider } from "@mui/material";
import { Collapsing, FullWidthFormControl } from "./Containers"
import { PadlessH2, PadlessH3 } from "./Text"
import React from "react"
import { AppContext } from "../../context/AppContext";


const T2Controls = (props) => {
  const {
    dataName, setDataName,
    rotateModel, setRotateModel,
    pointCloudVersion, setPointCloudVersion,
    displayCoords, setDisplayCoords,
    vertexSize, setVertexSize,
    wireFrameMode, setWireFrameMode,
    approximationMethod, setApproximationMethod,
    uSubDiv, setUSubDiv,
    vSubDiv, setVSubDiv,
    subDivMultiplier, setMultiplier,
  } = React.useContext(AppContext);

  const sliders = {
    min: 3,
    max: 100,
    step: 1,
    defaultValue: 10,
    kMin: 1,
    kMax: 10,
    labels: ["m (x-dimension)", "n (y-dimension)"],
  }

  const sliderValues = [uSubDiv, vSubDiv];
  const setSliderValues = [setUSubDiv, setVSubDiv];


  const handleSliderChange = (e, i) => {
    if (e.target.value < sliders.min || e.target.value > sliders.max) return;
    setSliderValues[i](e.target.value);
  };

  return (
    <Collapsing title={<PadlessH2>Task 2: Surfaces</PadlessH2>} initiallyOpened={props.initiallyOpened}>

      <FullWidthFormControl>
        <FormLabel>Approximation Method</FormLabel>
        <Select
          value={approximationMethod}
          onChange={(e) => setApproximationMethod(e.target.value)}
        >
          <MenuItem value="ls">Least Squares</MenuItem>
          <MenuItem value="wls">MLS-Wendland (Task 1)</MenuItem>
          <MenuItem value="mls">MLS-Epsilon (Task 2)</MenuItem>
          <MenuItem value="btps">Bézier tensor product surface (Task 3)</MenuItem>

        </Select>
      </FullWidthFormControl>

      <FullWidthFormControl>
        <PadlessH3>Surface Detail</PadlessH3>
        {sliders.labels.map((label, i) => {
          return (
            <div key={i}>
              <FormLabel>{label}</FormLabel>
              <Slider
                value={sliderValues[i]}
                onChange={(e) => handleSliderChange(e, i)}
                valueLabelDisplay="auto"
                step={sliders.step}
                min={1}
                max={100}
              />
            </div>
          );
        })}

        <div>
          <FormLabel>Multiplier</FormLabel>
          <Slider
            value={subDivMultiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            valueLabelDisplay="auto"
            step={sliders.step}
            min={sliders.kMin}
            max={sliders.kMax}
          />
        </div>
      </FullWidthFormControl>

      <FullWidthFormControl>
        <Button variant="contained" color="primary" onClick={props.onComputeSurface}>Compute Surface</Button>

      </FullWidthFormControl>


      <FormControlLabel control={<Checkbox checked={wireFrameMode} onClick={() => setWireFrameMode(!wireFrameMode)} />} label="Wireframe Mode" />
      {/* <Checkbox checked={wireFrameMode} onClick={() => setWireFrameMode(!wireFrameMode)} /> */}
    </Collapsing>

  );
};

export default T2Controls;