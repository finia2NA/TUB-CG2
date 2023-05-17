import React, { useState } from "react";
import styled from "styled-components";
import { Collapse } from "react-collapse";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { FormControl } from '@mui/material';

// This file countains various UI wrappers for components

export const FullWidthFormControl = styled(FormControl)`
  width: 100%;
`;

const LightContainer = styled.div`
  padding: 4px;
`;

const Creme = styled.div`
  margin: 8px 12px 8px;
`;

export const H3Wrapper = styled.div`
  margin: 16px 0px;
`;

const Collapsing = ({ initiallyOpened, title, children, style }) => {
  const [open, setOpen] = useState(initiallyOpened);

  return (
    <LightContainer style={style}>
      <div
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => setOpen(prev => !prev)}
      >
        {title}

        {open && <ExpandLess />}
        {!open && <ExpandMore />}
      </div>

      <Collapse isOpened={open}>
        <Creme>{children}</Creme>
      </Collapse>
    </LightContainer>
  );
};

export { LightContainer, Collapsing };
