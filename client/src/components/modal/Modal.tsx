import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';

interface ModalProps {
  children?: ReactElement;
  width: string;
  height: string;
  position: string[];
}

export default function Modal({ children, width, height, position }: ModalProps): ReactElement {
  return (
    <ModalContainer>
      <ModalBox width={width} height={height} position={position}>
        {children}
      </ModalBox>
    </ModalContainer>
  );
}

const ModalContainer = styled.div``;
const ModalBox = styled.div<ModalProps>`
  background-color: white;
  border-radius: 4px;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  position: absolute;
  box-shadow: rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px,
    rgb(15 15 15 / 20%) 0px 9px 24px;
  min-width: 180px;
  top: ${(props) => props.position[0]};
  right: ${(props) => props.position[1]};
  bottom: ${(props) => props.position[2]};
  left: ${(props) => props.position[3]};
  z-index: 2;
`;
