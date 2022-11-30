import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import BlockContent from '@/components/BlockContent';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface BlockInfo {
  blockId: number;
  content: string;
  index: number;
  type: string;
  focus?: boolean;
}

interface PageInfo {
  nextId: number;
  pageId: string;
  blocks: BlockInfo[];
}

interface EditedBlockInfo {
  block: BlockInfo;
  type: 'new' | 'change' | 'delete';
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
  const [editedBlock, setEditedBlock] = useState<EditedBlockInfo | null>(null);
  // console.log(pageInfo);
  const updateIndex = (diff: number) => (block: BlockInfo) => ({
    ...block,
    index: block.index + diff,
  });
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
        ...prev.blocks.slice(index - 1).map(updateIndex(1)),
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

  const deleteBlock = ({ block }: { block: BlockInfo }) => {
    console.log('🚀 ~ file: PageComponent.tsx:88 ~ PageComponent ~ deleteBlock', block);
    setEditedBlock({ block, type: 'delete' });
  };

  /* editedBlock */
  useEffect(() => {
    console.log('🚀 ~ file: PageComponent.tsx:94 ~ PageComponent ~ editedBlock', editedBlock);
    if (!editedBlock || editedBlock.block === undefined) return;
    if (editedBlock.type === 'delete') {
      editedBlock !== undefined &&
        setPageInfo((prev) => ({
          ...prev,
          blocks: [
            ...prev.blocks.slice(0, editedBlock.block.index - 1),
            ...prev.blocks.slice(editedBlock.block.index).map(updateIndex(-1)),
          ],
        }));
      editedBlock.block.index !== 1 &&
        setFocusBlockId(pageInfo.blocks[editedBlock.block.index - 2].blockId ?? null);
    } else {
      const { blockId, content, index, type, focus } = editedBlock.block;
      setPageInfo((prev) => ({
        ...prev,
        blocks: [
          ...prev.blocks.slice(0, index - 1),
          { ...editedBlock.block, blockId: type === 'new' ? prev.nextId : blockId },
          ...prev.blocks.slice(index - 1).map(updateIndex(1)),
        ],
        nextId: type === 'new' ? prev.nextId + 1 : prev.nextId,
      }));
      setFocusBlockId(blockId);
    }
  }, [editedBlock]);

  const onFucusIndex = (targetIndex: string) => {
    const blocks = document.querySelectorAll('div.content');
    const target = [...blocks].find((el) => el.getAttribute('data-index') === targetIndex);
    (target as HTMLElement).tabIndex = -1;
    (target as HTMLElement).focus();
  };

  const moveBlock = ({
    e,
    // type,
    content,
    index,
  }: {
    e: React.KeyboardEvent<HTMLDivElement>;
    // type: string;
    content: string;
    index: number;
  }) => {
    if (e.code === 'ArrowUp') {
      if (index === 1) {
        return;
      }
      onFucusIndex(String(index - 1));
    } else if (e.code === 'ArrowDown') {
      if (index === pageInfo.blocks[pageInfo.blocks.length - 1].index) {
        return;
      }
      onFucusIndex(String(index + 1));
    }
  };

  useEffect(() => {
    const onFocus = (targetBlockId: string) => {
      const contents = document.querySelectorAll('div.content');
      // console.log('🚀 ~ file: PageComponent.tsx ~ line 90 ~ onFocus ~ contents', contents);
      // console.log(
      //   'attr test => ',
      //   [...contents][0].getAttribute('data-blockid'),
      //   typeof [...contents][0].getAttribute('data-blockid'),
      // );
      const target = [...contents].find((el) => el.getAttribute('data-blockid') === targetBlockId);
      if (target) {
        // console.log('🚀 ~ file: PageComponent.tsx ~ line 122 ~ onFocus ~ target', target);
        (target as any).tabIndex = -1;
        (target as any).focus();
        (target as any).tabIndex = 0;
      }
    };

    // console.log(
    //   '🚀 ~ file: PageComponent.tsx ~ line 87 ~ useLayoutEffect ~ focusBlockId',
    //   focusBlockId,
    // );

    focusBlockId && onFocus(String(focusBlockId));
    setFocusBlockId(null);
  }, [focusBlockId]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    console.log(pageInfo.blocks);
    console.log('res = ', result);

    setPageInfo((prev) => {
      const blocks = [...prev.blocks];
      const [reOrderedBlock] = blocks.splice(result.source.index - 1, 1);
      blocks.splice((result?.destination?.index as number) - 1, 0, reOrderedBlock);
      const arrayedBlocks = blocks.map((e, i) => {
        return { ...e, index: i + 1 };
      });
      return { ...prev, blocks: arrayedBlocks };
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="blocks">
        {(provided) => (
          <PageBox className="blocks" {...provided.droppableProps} ref={provided.innerRef}>
            {pageInfo?.blocks &&
              pageInfo.blocks.map((block, idx) => (
                <Draggable
                  key={block.blockId}
                  draggableId={block.blockId.toString()}
                  index={idx + 1}
                >
                  {(provided) => (
                    <BlockContent
                      key={block.blockId}
                      block={block}
                      blockId={block.blockId}
                      newBlock={addBlock}
                      changeBlock={changeBlock}
                      moveBlock={moveBlock}
                      deleteBlock={deleteBlock}
                      index={block.index}
                      type={block.type}
                      provided={provided}
                    />
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </PageBox>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const PageBox = styled.div`
  width: 100%;
  flex: 1;
  margin-top: 45px;
`;

const ExampleContainer = styled.div`
  width: 100%;
  display: flex;
  background-color: blue;
  margin: 10px;
`;

const DragExample = styled.div`
  background-color: red;
  height: 20px;
  margin: 10px;
  width: 100px;
`;
