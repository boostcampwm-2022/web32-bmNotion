import React, { useState, ReactElement, useEffect } from 'react';
import BlockModalContentType from './BlockModalContentType';
import styled from 'styled-components';

interface BlockInfo {
  blockId: string;
  content: string;
  index: number;
  type: string;
  focus?: boolean;
}

interface BlockModalContentProps {
  handleType: Function;
  block: BlockInfo;
}

export default function BlockModalContent({
  handleType,
  block,
}: BlockModalContentProps): ReactElement {
  const contentTypeArr = [
    {
      title: '텍스트',
      contents: '일반 텍스트를 사용해 쓰기를 시작하세요.',
      image: '/assets/typeImages/text.png',
      type: 'TEXT',
    },
    {
      title: '제목1',
      contents: '섹션 제목(대)',
      image: '/assets/typeImages/h1.png',
      type: 'H1',
    },
    {
      title: '제목2',
      contents: '섹션 제목(중)',
      image: '/assets/typeImages/h2.png',
      type: 'H2',
    },
    {
      title: '제목3',
      contents: '섹션 제목(소)',
      image: '/assets/typeImages/h3.png',
      type: 'H3',
    },
  ];

  const renderContentType = () => {
    return (
      <>
        {contentTypeArr.map((e) => {
          return (
            <BlockModalContentType
              title={e.title}
              contents={e.contents}
              image={e.image}
              handleType={handleType}
              type={e.type}
              block={block}
            />
          );
        })}
      </>
    );
  };
  return <BlockModalContainer>{renderContentType()}</BlockModalContainer>;
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
