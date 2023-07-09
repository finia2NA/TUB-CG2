import React, { useContext } from "react"

import { Button, Checkbox, FormControlLabel, FormLabel, MenuItem, Select, Slider } from "@mui/material"
import { Collapsing, FullWidthFormControl } from "./Containers"
import { PadlessH2 } from "./Text"
import { AppContext } from "../../context/AppContext"



const T4Controls = (props) => {

  const {
    smoothingMethod, setSmoothingMethod,
    smoothingLambda, setSmoothingLambda,
    smoothingSteps, setSmoothingSteps,
    showPreSmoothing, setShowPreSmoothing,
    smoothingEigenPercentage, setEigenPercentage,
  } = useContext(AppContext);

  const smoothingMethods = [
    "laplace",
    "cotan-laplace",
    "cotan-laplace-implicit",
    "cotan-eigen",
  ]


  return (
    <Collapsing title={<PadlessH2>Series 4: Smoothing</PadlessH2>} initiallyOpened={props.initiallyOpened}>
      <FullWidthFormControl>
        <FormLabel>Smoothing Method</FormLabel>
        <Select
          value={smoothingMethod}
          onChange={(e) => setSmoothingMethod(e.target.value)}
        >
          {smoothingMethods.map((method, i) => {
            return (
              <MenuItem key={i} value={method}>{method}</MenuItem>
            )
          })}
        </Select>
       
        {smoothingMethod==="cotan-eigen"?
          <div>
            <FormLabel>Eigenvectors Percentage</FormLabel>
            <Slider
              value={smoothingEigenPercentage}
              onChange={(e) => setEigenPercentage(e.target.value)}
              valueLabelDisplay="auto"
              step={0.01}
              min={0}
              max={1}
            />
          </div>
          :<div>
            <FormLabel>Lambda</FormLabel>
            <Slider
              value={smoothingLambda}
              onChange={(e) => setSmoothingLambda(e.target.value)}
              valueLabelDisplay="auto"
              step={0.005}
              min={0.005}
              max={0.2}
            />
            <FormLabel>Steps</FormLabel>
            <Slider
              value={smoothingSteps}
              onChange={(e) => setSmoothingSteps(e.target.value)}
              valueLabelDisplay="auto"
              step={1}
              min={1}
              max={20}
            />
          </div>}
        <Button variant="contained" color="primary" onClick={props.onSmooth}>Smooth</Button>
        <FormControlLabel control={<Checkbox checked={showPreSmoothing} onChange={(e) => setShowPreSmoothing(e.target.checked)
        } />} label="Show Pre-smoothing geometry" />
      </FullWidthFormControl>
    </Collapsing>
  )
}

export default T4Controls