import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';

interface BlockInfo {
  blockId: string;
  content: string;
  index: number;
  type: string;
  createdAt: string;
}

interface TypeProps {
  image: string;
  title: string;
  contents: string;
  type: string;
  handleType: Function;
  block: BlockInfo;
}

export default function BlockModalContentType({
  image,
  title,
  contents,
  type,
  handleType,
  block,
}: TypeProps): ReactElement {
  return (
    <TypeContainer
      onClick={() => {
        handleType(block, type);
      }}
    >
      <TypeImage image={image} />
      <TypeTextContainer>
        <TypeTextTitle>{title}</TypeTextTitle>
        <TypeTextContents>{contents}</TypeTextContents>
      </TypeTextContainer>
    </TypeContainer>
  );
}

const TypeContainer = styled.div`
  display: flex;
  width: calc(100% - 8px);
  height: 55px;
  border-radius: 3px;
  align-items: center;
  &:hover {
    background-color: #ebebea;
  }
`;

const TypeImage = styled.div<{ image: string }>`
  width: 46px;
  height: 46px;
  border-radius: 3px;
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  box-shadow: rgb(15 15 15 / 10%) 0px 0px 0px 1px;
  margin: 0px 4px 0px 10px;
`;

const TypeTextContainer = styled.div`
  display: flex;
  height: 55px;
  flex-direction: column;
  justify-content: center;
  margin: 0px 12px 0px 6px;
`;

const TypeTextTitle = styled.div`
  font-size: 14px;
  color: rgb(55, 53, 47);
`;

const TypeTextContents = styled.div`
  font-size: 12px;
  color: rgba(55, 53, 47, 0.65);
`;
