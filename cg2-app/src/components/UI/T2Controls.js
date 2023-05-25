import { Button, FormLabel, MenuItem, Select, Slider } from "@mui/material";
import { Collapsing, FullWidthFormControl } from "./Containers"
import { PadlessH2, PadlessH3 } from "./Text"


const T2Controls = (props) => {

  const sliders = {
    min: 3,
    max: 100,
    step: 1,
    defaultValue: 10,
    kMin: 1,
    kMax: 10,
    labels: ["m (u-dimension)", "n (v-dimension)"],
  }

  const sliderValues = [props.uSubDiv, props.vSubDiv];
  const setSliderValues = [props.setUSubDiv, props.setVSubDiv];


  const handleSliderChange = (e, i) => {
    if (e.target.value < sliders.min || e.target.value > sliders.max) return;
    setSliderValues[i](e.target.value);
  };


  return (
    <Collapsing title={<PadlessH2>Task 2: Surfaces</PadlessH2>} initiallyOpened={props.initiallyOpened}>

      <FullWidthFormControl>
        <FormLabel>Approximation Method</FormLabel>
        <Select
          value={props.approximationMethod}
          onChange={(e) => props.setApproximationMethod(e.target.value)}
        >
          <MenuItem value="ls">Least Squares</MenuItem>
          <MenuItem value="wls">Weighted Least Squares</MenuItem>
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
            value={props.multiplier}
            onChange={(e) => props.setMultiplier(e.target.value)}
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
    </Collapsing>

  );
};

export default T2Controls;