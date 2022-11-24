import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
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
  const [focusBlockId, setFocusBlockId] = useState<number | null>(null);

  const onFocus = (targetBlockId: string) => {
    const contents = document.querySelectorAll('div.content');
    const target = [...contents].find((el) => el.getAttribute('data-blockid') === targetBlockId);
    if (target) {
      (target as any).tabIndex = -1;
      (target as any).focus();
    }
  };

  const updateIndex = (block: BlockInfo): BlockInfo => ({ ...block, index: block.index + 1 });
  const addBlock = ({
    blockId,
    type,
    content,
    index,
  }: {
    blockId: number;
    type: string;
    content: string;
    index: number;
  }) => {
    console.log('addblock');
    setPageInfo((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks.slice(0, index - 1),
        { content, type, index, blockId: prev.nextId },
        ...prev.blocks.slice(index - 1).map(updateIndex),
      ],
      nextId: prev.nextId + 1,
    }));
    setFocusBlockId(pageInfo.nextId);
  };

  const changeBlock = ({
    blockId,
    type,
    content,
    index,
  }: {
    blockId: number;
    type: string;
    content: string;
    index: number;
  }) => {
    setPageInfo((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.blockId === blockId ? { ...block, type, content, ref: true } : block,
      ),
    }));
    setFocusBlockId(blockId);
  };

  useLayoutEffect(() => {
    focusBlockId && onFocus(String(focusBlockId));
  }, [focusBlockId]);

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
