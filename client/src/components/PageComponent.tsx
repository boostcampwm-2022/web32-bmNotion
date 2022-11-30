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
  title: string;
  nextId: number;
  pageId: string;
  blocks: BlockInfo[];
}

interface EditedBlockInfo {
  block: BlockInfo;
  type: 'new' | 'change';
}

const sampleBlocks: BlockInfo[] = [{ blockId: 1, index: 1, content: '', type: 'TEXT' }];

const samplePageInfo: PageInfo = {
  title: "샘플 제목",
  nextId: 2,
  pageId: 'abc',
  blocks: sampleBlocks,
};

export default function PageComponent(): React.ReactElement {
  const [pageInfo, setPageInfo] = useState(samplePageInfo);
  const [focusBlockId, setFocusBlockId] = useState<number | null>(null);
  const [editedBlock, setEditedBlock] = useState<EditedBlockInfo | null>(null);
  console.log(pageInfo);
  
  const handleOnInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = (e.target as HTMLDivElement).textContent;
    if(newContent) {
      pageInfo.title = newContent;
    }
  }
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

  useEffect(() => {
    if (editedBlock === null) return;
    const { blockId, content, index, type, focus } = editedBlock.block;
    setPageInfo((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks.slice(0, index - 1),
        { ...editedBlock.block, blockId: type === 'new' ? prev.nextId : blockId },
        ...prev.blocks.slice(index - 1).map(updateIndex),
      ],
      nextId: prev.nextId + 1,
    }));
    setFocusBlockId(pageInfo.nextId);
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
    <>
      <PageTitle 
        contentEditable
        onInput={handleOnInput}>
        {pageInfo.title}
      </PageTitle>
      <button onClick={()=>console.log(pageInfo.title)}>aaa</button>
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
    </>
    
  );
}

const PageBox = styled.div`
  width: 100%;
  flex: 1;
  margin-top:5px;
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

const PageContainer = styled.div<{ maxWidth: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: ${(props) => props.maxWidth}; //900px보다 작으면 width 100%;
  min-width: 0px;
  width: 100%;
  //버튼 클릭하면 max-width: 100%
  transition: all 0.1s linear;
`;
const PageTitle = styled.div`
  width: 100%;
  margin-top: 100px;
  color: rgb(55, 53, 47);
  font-weight: 700;
  line-height: 1.2;
  font-size: 40px;
  padding:3px;
  background-color: yellowgreen;
`;