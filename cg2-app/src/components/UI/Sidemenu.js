import { useState } from "react";
import Button from '@mui/material/Button';
import { Checkbox, FormControl, FormControlLabel, FormLabel, MenuItem, Select, Slider, TextField } from "@mui/material";

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
      <h1>Side Menu</h1>
      <div>
        <h2>Gather Controls</h2>
        <FormControl>
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
        </FormControl>
      </div>
      <div>
        <h2>Selection Controls</h2>

        <FormControl>
          <p style={{ margin: "-16px 0px 8px 0px", color: "grey" }}>Click on a point while holding shift to select it</p>
          <Button variant="contained" color="secondary" onClick={props.onClearSelection}>Clear Selection</Button>
        </FormControl>
      </div>
      <div>
        <h2>Display Controls</h2>
        <FormControl>
          <FormControlLabel control={<Checkbox checked={props.displayLines} onChange={(e) => props.setDisplayLines(e.target.checked)
          } />} label="Show Lines" />
          <FormControlLabel control={<Checkbox checked={props.displayCoords} onChange={(e) => props.setDisplayCoords(e.target.checked)
          } />} label="Show Coordinate System" />
          <FormLabel>Datastructure Display Depth</FormLabel>
          <Slider
            value={props.dsDisplayDepth}
            onChange={(e) => props.setDsDisplayDepth(e.target.value)}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={8}
          />
        </FormControl>

      </div>
    </div >
  );
}

export default Sidemenu;