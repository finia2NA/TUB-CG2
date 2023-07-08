import React, { useContext } from "react"

import { Button, FormLabel, MenuItem, Select, Slider } from "@mui/material"
import { Collapsing, FullWidthFormControl } from "./Containers"
import { PadlessH2 } from "./Text"
import { AppContext } from "../../context/AppContext"



const T4Controls = (props) => {

  const {
    smoothingMethod, setSmoothingMethod,
    smoothingLambda, setSmoothingLambda,
    smoothingSteps, setSmoothingSteps,
  } = useContext(AppContext);

  const smoothingMethods = [
    "laplace",
    "cotan-laplace",
    "euler-laplace",
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
        <FormLabel>Lambda</FormLabel>
          <Slider
            value={smoothingLambda}
            onChange={(e) => setSmoothingLambda(e.target.value)}
            valueLabelDisplay="auto"
            step={0.005}
            min={0.005}
            max={0.2}
          /><FormLabel>Steps</FormLabel>
          <Slider
            value={smoothingSteps}
            onChange={(e) => setSmoothingSteps(e.target.value)}
            valueLabelDisplay="auto"
            step={1}
            min={1}
            max={20}
          />
        <Button variant="contained" color="primary" onClick={props.onSmooth}>Smooth</Button>
      </FullWidthFormControl>
    </Collapsing>
  )
}

export default T4Controls