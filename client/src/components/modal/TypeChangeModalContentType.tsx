import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';

interface BlockInfo {
  blockId: string;
  content: string;
  index: number;
  type: string;
  focus?: boolean;
}
interface TypeProps {
  image: string;
  text: string;
  type: string;
  handleType: Function;
  block: BlockInfo;
  selectedBlocks: BlockInfo[];
}

export default function TypeChangeModalContentType({
  image,
  text,
  type,
  handleType,
  selectedBlocks,
  block,
}: TypeProps): ReactElement {
  return (
    <TypeContainer
      onClick={() => {
        if (selectedBlocks.length !== 0) {
          selectedBlocks.forEach((e) => handleType(e, type));
          console.log('여러 개');
        } else {
          handleType(block, type);
          console.log('한 개');
        }
      }}
    >
      <TypeImage image={image} />
      <TypeTextContainer>
        <TypeText>{text}</TypeText>
      </TypeTextContainer>
    </TypeContainer>
  );
}

const TypeContainer = styled.div`
  display: flex;
  width: calc(100% - 8px);
  height: 28px;
  border-radius: 3px;
  align-items: center;

  &:hover {
    background-color: #ebebea;
  }
`;

const TypeImage = styled.div<{ image: string }>`
  width: 22px;
  height: 22px;
  border-radius: 3px;
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px;
  margin: 0px 4px 0px 8px;
`;

const TypeTextContainer = styled.div`
  display: flex;
  height: 55px;
  flex-direction: column;
  justify-content: center;
  margin: 0px 12px 0px 6px;
`;

const TypeText = styled.div`
  font-size: 14px;
  color: rgb(55, 53, 47);
`;
