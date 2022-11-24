import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import BlockContent from '@/components/BlockContent';

interface BlockInfo {
  blockId: number;
  content: string;
  index: number;
  type: string;
}

interface PageInfo {
  nextId: number;
  pageId: string;
  blocks: BlockInfo[];
}

const sampleBlocks: BlockInfo[] = [{ blockId: 1, index: 1, content: '', type: 'TEXT' }];

const samplePageInfo: PageInfo = {
  nextId: 2,
  pageId: 'abc',
  blocks: sampleBlocks,
};

export default function PageComponent(): React.ReactElement {
  const [pageInfo, setPageInfo] = useState(samplePageInfo);

  const sortedByIndex = (a: BlockInfo, b: BlockInfo) => a.index - b.index;
  const addBlock = ({ type, content, index }: { type: string; content: string; index: number }) => {
    console.log('addblock');
    const updateIndex = (prevIndex: number) => prevIndex + Number(prevIndex >= index);
    setPageInfo((prev) => ({
      ...prev,
      blocks: [...prev.blocks, { content, type, index, blockId: prev.nextId }]
        .map((block) => ({ ...block, index: updateIndex(block.index) }))
        .sort(sortedByIndex),
      nextId: prev.nextId + 1,
    }));
  };
  const changeBlock = ({ blockId, type, content }: { blockId: number; type: string; content: string }) => {
    setPageInfo((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) => (block.blockId === blockId ? { ...block, type, content } : block)),
    }));
  };

  return (
    <PageBox>
      {pageInfo.blocks.map((block, idx) => (
        <BlockContent
          key={block.blockId}
          blockId={block.blockId}
          newBlock={addBlock}
          changeBlock={changeBlock}
          index={block.index}
          type={block.type}
        />
      ))}
    </PageBox>
  );
}

const PageBox = styled.div`
  width: 100%;
  flex: 1;
  margin-top: 45px;
`;
