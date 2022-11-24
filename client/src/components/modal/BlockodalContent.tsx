import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';

export default function BlockModalContent(): ReactElement {
  return (
    <BlockModalContainer>
      <TypeContainer>
        <TypeImage />
        <TypeTextContainer>
          <TypeTextTitle>텍스트</TypeTextTitle>
          <TypeTextContents>일반 텍스트를 사용해 쓰기를 시작하세요.</TypeTextContents>
        </TypeTextContainer>
      </TypeContainer>
    </BlockModalContainer>
  );
}

const BlockModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding-top: 8px;

  &::-webkit-scrollbar {
    width: 10px;
    background-color: #edece9;
  }
  &::-webkit-scrollbar-thumb {
    background: #d3d1cb;
    border-radius: 6px;
  }
`;

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

const TypeImage = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 3px;
  background-image: url('/assets/typeImages/text.png');
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
