import React, { Dispatch, ReactElement, useState, useRef, useLayoutEffect, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import BlockContent from '@/components/block/BlockContent';

interface StyledBlockContentProps {
  block: BlockInfo;
  blockId?: string; // page - Id 불변
  index?: number; // page - Index 변하는값
  content?: string; // 눈에 보이는 텍스트 내용
  type: string;
  focus?: boolean;
  createBlock: (param: CreateBlockParam) => string;
  changeBlock: (param: ChangeBlockParam) => string;
  provided: any;
  moveBlock: Function;
  deleteBlock: (param: DeleteBlockParam) => string;
  selectedBlocks: BlockInfo[];
  allBlocks: BlockInfo[];
  task: any;
  handleSetCaretPositionById: Function;
  handleSetCaretPositionByIndex: Function;
  pageInfo: PageInfo;
}

export default function StyledBlockContent({
  block,
  createBlock,
  changeBlock,
  deleteBlock,
  type,
  provided,
  moveBlock,
  selectedBlocks,
  allBlocks,
  handleSetCaretPositionById,
  handleSetCaretPositionByIndex,
  task,
  pageInfo,
}: StyledBlockContentProps): ReactElement {
  const StyleBox =
    {
      H1: H1BlockContentBox,
      H2: H2BlockContentBox,
      H3: H3BlockContentBox,
      TEXT: TextBlockContentBox,
      IMG: IMGBlockContentBox,
    }[type] || TextBlockContentBox;
  const renderTypeBlock = () => {
    return (
      <StyleBox>
        <BlockContent
          key={block.blockId}
          block={block}
          blockId={block.blockId}
          createBlock={createBlock}
          changeBlock={changeBlock}
          moveBlock={moveBlock}
          deleteBlock={deleteBlock}
          index={block.index}
          type={block.type}
          provided={provided}
          selectedBlocks={selectedBlocks}
          task={task}
          allBlocks={allBlocks}
          handleSetCaretPositionById={handleSetCaretPositionById}
          handleSetCaretPositionByIndex={handleSetCaretPositionByIndex}
          pageInfo={pageInfo}
        />
      </StyleBox>
    );
  };
  return <>{renderTypeBlock()}</>;
}

const TextBlockContentBox = styled.div`
  max-width: 100%;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  caret-color: rgb(55, 53, 47);
`;

const H1BlockContentBox = styled.div`
  max-width: 100%;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  caret-color: rgb(55, 53, 47);
  font-weight: 600;
  font-size: 1.875em;
  line-height: 1.3;
  margin-top: 32px;
  margin-bottom: 4px;
`;

const H2BlockContentBox = styled.div`
  max-width: 100%;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  caret-color: rgb(55, 53, 47);
  font-weight: 600;
  font-size: 1.5em;
  line-height: 1.3;
  margin-top: 24px;
`;

const H3BlockContentBox = styled.div`
  max-width: 100%;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  caret-color: rgb(55, 53, 47);
  font-weight: 600;
  font-size: 1.25em;
  line-height: 1.3;
  margin-top: 16px;
`;

const IMGBlockContentBox = styled.div`
  object-fit: cover;
  cursor: pointer;
  width: 100%;
`;
