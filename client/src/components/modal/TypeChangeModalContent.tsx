import React, { useState, ReactElement, useEffect } from 'react';
import TypeChangeModalContentType from './TypeChangeModalContentType';
import styled from 'styled-components';

interface TypeChangeModalContentProps {
  handleType: Function;
  block: BlockInfo;
  selectedBlocks: BlockInfo[];
}

export default function TypeChangeModalContent({
  handleType,
  selectedBlocks,
  block,
}: TypeChangeModalContentProps): ReactElement {
  const contentTypeArr = [
    {
      text: '텍스트',
      image: '/assets/typeImages/text.png',
      type: 'TEXT',
    },
    {
      text: '제목1',
      image: '/assets/typeImages/h1.png',
      type: 'H1',
    },
    {
      text: '제목2',
      image: '/assets/typeImages/h2.png',
      type: 'H2',
    },
    {
      text: '제목3',
      image: '/assets/typeImages/h3.png',
      type: 'H3',
    },
    {
      text: '글 머리 기호 목록',
      image: '/assets/typeImages/ul.png',
      type: 'UL',
    },
  ];

  const renderContentType = () => {
    return (
      <>
        {contentTypeArr.map((e) => {
          return (
            <TypeChangeModalContentType
              key={block.blockId + e.text}
              text={e.text}
              image={e.image}
              handleType={handleType}
              type={e.type}
              selectedBlocks={selectedBlocks}
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
  width: 100%;
  height: 100%;
  padding-top: 6px;
`;
