import React, { useState } from "react";
import styled from "styled-components";
import { Collapse } from "react-collapse";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

// This file countains various UI wrappers for components

const LightContainer = styled.div`
  border-top: 1px solid grey;
  margin: 10px;
  padding: 4px;
`;

const Creme = styled.div`
  margin: 8px 12px 8px;
`;

const SectionHeading = styled.span`
  font-family: "Roboto", sans-serif;
  font-weight: 200;
  font-size: 18px;
`;

const Collapsing = (props) => {
  const [open, setOpen] = useState(props.initiallyOpened);

  return (
    <LightContainer>
      <div
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => setOpen(!open)}
      >
        <SectionHeading>{props.name}</SectionHeading>

        {open && <ExpandLess />}
        {!open && <ExpandMore />}
      </div>

      <Collapse isOpened={open}>
        <Creme>{props.children}</Creme>
      </Collapse>
    </LightContainer>
  );
};

export { LightContainer, Collapsing };
