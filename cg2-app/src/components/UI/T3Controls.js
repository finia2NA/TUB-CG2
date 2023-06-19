import { Button, Checkbox, FormControlLabel, FormLabel, MenuItem, Select, Slider } from "@mui/material";
import { Collapsing, FullWidthFormControl } from "./Containers"
import { PadlessH2, PadlessH3 } from "./Text"
import React from "react"
import { AppContext } from "../../context/AppContext";

export const implicitDimDefault = 5;

export const implicitAlphaDefault = 0.01;

export const implicitBasisFunctionDefault = 0;

export const wendlandRadiusDefault = 0.1;


const T3Controls = (props) => {
  const {
    implicitDim, setImplicitDim,
    implicitAlpha, setImplicitAlpha,
    implicitDegree, setImplicitDegree,
    wendlandRadius, setWendlandRadius,
    hasNormals
  } = React.useContext(AppContext);

  const dimSliders = {
    min: 3,
    max: 25,
    step: 1,
    defaultValue: implicitDimDefault,
    labels: ["nx", "ny", "nz"],
  }

  const handleSliderChange = (e, i) => {
    if (e.target.value < dimSliders.min || e.target.value > dimSliders.max) return;
    setImplicitDim(prev => {
      const newDim = [...prev];
      newDim[i] = e.target.value;
      return newDim;
    });
  };

  const onClickButton = () => {
    props.onComputeImplicit(...implicitDim, implicitDegree, wendlandRadius, implicitAlpha);
  }

  return (
    <Collapsing title={<PadlessH2>Task 3: Implicit</PadlessH2>} initiallyOpened={props.initiallyOpened}>

      <FullWidthFormControl disabled={!hasNormals}>
        <PadlessH3>Cube Grid</PadlessH3>
        {dimSliders.labels.map((label, i) => {
          return (
            <div key={i}>
              <FormLabel>{label}</FormLabel>
              <Slider
                value={implicitDim[i]}
                onChange={(e) => handleSliderChange(e, i)}
                valueLabelDisplay="auto"
                step={dimSliders.step}
                min={dimSliders.min}
                max={dimSliders.max}
              />
            </div>
          );
        })}
        <PadlessH3>Function Parameters</PadlessH3>
        <div>
          <FormLabel>Alpha</FormLabel>
          <Slider
            value={implicitAlpha}
            onChange={(e) => setImplicitAlpha(e.target.value)}
            valueLabelDisplay="auto"
            step={0.001}
            min={0.001}
            max={0.1}
          />
        </div>
        <div>
          <FormLabel>Wendland-Radius</FormLabel>
          <Slider
            value={wendlandRadius}
            onChange={(e) => setWendlandRadius(e.target.value)}
            valueLabelDisplay="auto"
            step={0.01}
            min={0.01}
            max={1}
          />
        </div>

        <FormLabel>WLS Basis Function</FormLabel>
        <Select
          value={implicitDegree}
          onChange={(e) => setImplicitDegree(e.target.value)}
        >
          <MenuItem value={0}>Constant</MenuItem>
          <MenuItem value={1}>Linear</MenuItem>
          <MenuItem value={2}>Quadratic</MenuItem>
        </Select>


        <div style={{ margin: "8px 0px", width: "100%" }}>
          <Button variant="contained" color="primary" onClick={onClickButton}>Compute Implicit Surface</Button>
        </div>

      </FullWidthFormControl>


    </Collapsing>

  );
};

export default T3Controls;