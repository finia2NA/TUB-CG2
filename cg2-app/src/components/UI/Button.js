import { Button as StandardButton } from "@mui/material";
import styled from "styled-components";

export const Button = styled(StandardButton)`
  variant: contained;
  color: ${props => props.color};
  width: 200px;
  `;