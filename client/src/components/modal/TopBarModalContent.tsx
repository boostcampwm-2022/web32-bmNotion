import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';

export default function TopBarModalContent({
  readerMode,
  isReaderMode,
}: {
  readerMode: Function;
  isReaderMode: boolean;
}): ReactElement {
  return (
    <TopBarModalContainer>
      <ReaderModeButton
        onClick={() => {
          readerMode();
        }}
      >
        {isReaderMode ? '읽기 전용' : '일반'}
      </ReaderModeButton>
    </TopBarModalContainer>
  );
}
const TopBarModalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const ReaderModeButton = styled.button`
  height: 28px;
  width: 100%;
  padding: 2px;
  min-height: 28px;
  font-size: 14px;
  line-height: 120%;

  &:hover {
    background-color: #ebebea;
  }
`;
