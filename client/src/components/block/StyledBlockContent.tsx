import React, { Dispatch, ReactElement, useState, useRef, useLayoutEffect, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import BlockContent from '@/components/block/BlockContent';

interface BlockInfo {
  blockId: number;
  content: string;
  index: number;
  type: string;
  focus?: boolean;
}

interface StyledBlockContentProps {
  block: BlockInfo;
  blockId?: number; // page - Id 불변
  index?: number; // page - Index 변하는값
  content?: string; // 눈에 보이는 텍스트 내용
  type: string;
  focus?: boolean;
  newBlock: Function;
  changeBlock: Function;
  provided: any;
  moveBlock: Function;
  deleteBlock: Function;
  storePageTrigger: ({ isDelay }: { isDelay: boolean }) => void;
}

export default function StyledBlockContent({
  block,
  newBlock,
  changeBlock,
  deleteBlock,
  type,
  provided,
  moveBlock,
  storePageTrigger,
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
          newBlock={newBlock}
          changeBlock={changeBlock}
          moveBlock={moveBlock}
          deleteBlock={deleteBlock}
          storePageTrigger={storePageTrigger}
          index={block.index}
          type={block.type}
          provided={provided}
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
  padding: 3px 2px;
`;

const H1BlockContentBox = styled.div`
  max-width: 100%;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  caret-color: rgb(55, 53, 47);
  padding: 3px 2px;
  font-weight: 600;
  font-size: 1.875em;
  line-height: 1.3;
`;

const H2BlockContentBox = styled.div`
  max-width: 100%;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  caret-color: rgb(55, 53, 47);
  padding: 3px 2px;
  font-weight: 600;
  font-size: 1.5em;
  line-height: 1.3;
`;

const H3BlockContentBox = styled.div`
  max-width: 100%;
  width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  caret-color: rgb(55, 53, 47);
  padding: 3px 2px;
  font-weight: 600;
  font-size: 1.25em;
  line-height: 1.3;
`;

const IMGBlockContentBox = styled.div`
  border-radius: 8px;
  background-color: hsl(0,0%,89%);
`;
