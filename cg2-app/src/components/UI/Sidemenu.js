import { useState } from "react";
import Button from '@mui/material/Button';
import { FormControl, FormLabel, MenuItem, RadioGroup, Select, Slider } from "@mui/material";

const slidermodes = {
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

const Sidemenu = (props) => {

  const [sliderMode, setSliderMode] = useState(slidermodes.knn);
  const [sliderValue, setSliderValue] = useState(slidermodes.knn.defaultValue);

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  const handleDropdownChange = (e) => {
    setSliderMode(slidermodes[e.target.value]);
    setSliderValue(slidermodes[e.target.value].defaultValue);
  };

  const onPointQuery = () => {
    props.onPointQuery(sliderMode.mode, sliderValue);
  }


  return (
    <div>

      <h1>Side Menu</h1>
      <div>
        <div>
          <h2>Gather Controls</h2>
          <FormControl>
            <FormLabel>Slider Mode</FormLabel>
            <Select defaultValue={"knn"} onChange={handleDropdownChange}>
              <MenuItem value={"knn"}>K-nearest-neighbour</MenuItem>
              <MenuItem value={"radius"}>Radius</MenuItem>
            </Select>
            <FormLabel>{sliderMode.sliderText}</FormLabel>
            <Slider
              value={sliderValue}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              step={sliderMode.step}
              min={sliderMode.min}
              max={sliderMode.max}
            />
            <Button variant="contained" color="primary" onClick={onPointQuery}>Gather</Button>
          </FormControl>
        </div>
        <div>
          <h2>Selection Controls</h2>

          <FormControl>
            <FormLabel>Selection Mode</FormLabel>
            <Button variant="contained" color="secondary" onClick={props.onClearSelection}>Clear Selection</Button>
          </FormControl>
        </div>
      </div>
    </div >
  );
}

export default Sidemenu;