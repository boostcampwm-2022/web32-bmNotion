import React, { useState, ReactElement, useEffect } from 'react';
import BlockModalContentType from './BlockModalContentType';
import styled from 'styled-components';

export default function BlockModalContent(): ReactElement {
  const contentTypeArr = [
    {
      title: '텍스트',
      contents: '일반 텍스트를 사용해 쓰기를 시작하세요.',
      image: '/assets/typeImages/text.png',
    },
    {
      title: '제목1',
      contents: '섹션 제목(대)',
      image: '/assets/typeImages/h1.png',
    },
    {
      title: '제목2',
      contents: '섹션 제목(중)',
      image: '/assets/typeImages/h2.png',
    },
    {
      title: '제목3',
      contents: '섹션 제목(소)',
      image: '/assets/typeImages/h3.png',
    },
  ];

  const renderContentType = () => {
    return (
      <>
        {contentTypeArr.map((e) => {
          return <BlockModalContentType title={e.title} contents={e.contents} image={e.image} />;
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
