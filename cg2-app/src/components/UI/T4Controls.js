import React from "react"

import { Button } from "@mui/material"
import { Collapsing } from "./Containers"
import { PadlessH2 } from "./Text"



const T4Controls = (props) => {
  return (
    <Collapsing title={<PadlessH2>Series 4: Smoothing</PadlessH2>} initiallyOpened={props.initiallyOpened}>
      <Button variant="contained" color="primary" onClick={props.onSmooth}>Test</Button>
    </Collapsing>
  )
}

export default T4Controls