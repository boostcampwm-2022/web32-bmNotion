import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import BlockContent from '@/components/BlockContent';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { API } from '@/config/config';
import { axiosGetRequest, axiosPostRequest } from '@/utils/axios.request';
import jwt from 'jsonwebtoken';
import { AxiosResponse } from 'axios';
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
  type: 'new' | 'change' | 'delete';
}

const sampleBlocks: BlockInfo[] = [{ blockId: 1, index: 1, content: '', type: 'TEXT' }];

const samplePageInfo: PageInfo = {
  title: '샘플 제목',
  nextId: 2,
  pageId: 'abc',
  blocks: sampleBlocks,
};

export default function PageComponent(): React.ReactElement {
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    title: '',
    nextId: 0,
    pageId: '',
    blocks: [],
  });
  const [focusBlockId, setFocusBlockId] = useState<number | null>(null);
  const [editedBlock, setEditedBlock] = useState<EditedBlockInfo | null>(null);

  const { pageid } = useParams();

  const storePage = () => {
    console.log('페이지 저장');
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    const requestBody = {
      pageid,
      title: pageInfo.title,
      blocks: pageInfo.blocks,
    };
    const onSuccess = (res: AxiosResponse) => {
      console.log('성공');
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    axiosPostRequest(API.UPDATE_PAGE, onSuccess, onFail, requestBody, requestHeader);
  };
  useEffect(() => {
    const handleStore = (e: KeyboardEvent) => {
      if (e.code === 'KeyS') {
        const isMac = /Mac/.test(window.clientInformation.platform);
        const commandKeyPressed = isMac ? e.metaKey === true : e.ctrlKey === true;
        if (commandKeyPressed === true) {
          e.preventDefault();
          storePage();
        }
      }
    };
    window.addEventListener('keydown', handleStore);
    return () => {
      window.removeEventListener('keydown', handleStore);
    };
  }, [pageInfo]);

  useEffect(() => {
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    const onSuccess = (res: AxiosResponse) => {
      setPageInfo({
        title: res.data.title,
        nextId: Math.max(...res.data.blocks.map((e: BlockInfo) => e.blockId), 1),
        pageId: pageid as string,
        blocks: res.data.blocks,
      });
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    axiosGetRequest(API.GET_PAGE + pageid, onSuccess, onFail, requestHeader);
  }, [pageid]);
  const updateIndex = (diff: number) => (block: BlockInfo) => ({
    ...block,
    index: block.index + diff,
  });

  const handleOnInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = (e.target as HTMLDivElement).textContent;
    if (newContent) {
      pageInfo.title = newContent;
    }
  };
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const elem = e.target as HTMLElement;
    const totalContent = elem.textContent || '';
    const offset = (window.getSelection() as Selection).focusOffset;
    const [preText, postText] = [totalContent.slice(0, offset), totalContent.slice(offset)];
    if (e.key === 'Enter') {
      e.preventDefault();
      if (totalContent.length === offset) {
        addBlock({ type: 'TEXT', content: '', index: 1 });
      } else {
        pageInfo.title = preText;
        elem.textContent = preText;
        addBlock({ type: 'TEXT', content: postText, index: 1 });
      }
    }
  };
  const addBlock = ({
    blockId,
    type,
    content,
    index,
  }: {
    blockId?: number;
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

  const onFocusIndex = (targetIndex: string) => {
    const blocks = document.querySelectorAll('div.content');
    const target = [...blocks].find(
      (el) => el.getAttribute('data-index') === targetIndex,
    ) as HTMLElement;
    if (target.childNodes.length === 0) {
      target.focus();
      return;
    }
  };

  const handleCaretIndex = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number,
    offset: number,
  ) => {
    e.preventDefault();

    const blocks = document.querySelectorAll('div.content');
    const target = [...blocks].find(
      (el) => el.getAttribute('data-index') === String(index),
    ) as HTMLElement;
    if (target.childNodes.length === 0) {
      return;
    }
    target.normalize();
    const range = document.createRange();
    const select = window.getSelection();

    if (target.innerHTML.includes('\n') && e.code === 'ArrowUp') {
      const lastLineLength = target.innerHTML.split('\n').slice(-1).join('').length;
      const baseLength = target.innerHTML.length - lastLineLength;
      range.setStart(
        target.childNodes[0],
        lastLineLength < offset ? baseLength + lastLineLength : baseLength + offset,
      );
    } else {
      range.setStart(
        target.childNodes[0],
        target.innerHTML.length < offset ? target.innerHTML.length : offset,
      );
    }
    range.collapse(true);

    select?.removeAllRanges();
    select?.addRange(range);
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
    const offset = (window.getSelection() as Selection).anchorOffset;
    const contents = document.querySelectorAll('div.content');
    const target = [...contents].find(
      (el) => el.getAttribute('data-blockid') === String(index),
    ) as HTMLElement;
    if (target.childNodes.length !== 0) {
      target.normalize();
    }
    const lastLineLength = target.innerHTML.split('\n').slice(-1).join('').length;
    const firstLineLength = target.innerHTML.split('\n')[0].length;
    const baseLength = target.innerHTML.length - lastLineLength;
    if (target.innerHTML.includes('\n')) {
      if (e.code === 'ArrowUp' && offset <= firstLineLength) {
        onFocusIndex(String(index - 1));
        handleCaretIndex(e, index - 1, offset);
        return;
      } else if (
        e.code === 'ArrowDown' &&
        baseLength < offset &&
        offset <= target.innerHTML.length
      ) {
        onFocusIndex(String(index + 1));
        handleCaretIndex(e, index + 1, offset - baseLength);
        return;
      } else {
        return;
      }
    } else {
      if (e.code === 'ArrowUp') {
        if (index === 1) {
          return;
        }
        onFocusIndex(String(index - 1));
        handleCaretIndex(e, index - 1, offset);
      } else if (e.code === 'ArrowDown') {
        if (index === pageInfo.blocks[pageInfo.blocks.length - 1].index) {
          return;
        }
        onFocusIndex(String(index + 1));
        handleCaretIndex(e, index + 1, offset);
      }
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

  if (pageInfo === null) return <div>로딩중</div>;
  return (
    <>
      <PageTitle contentEditable onInput={handleOnInput} onKeyDown={handleOnKeyDown}>
        {pageInfo.title}
      </PageTitle>
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
    </>
  );
}

const PageBox = styled.div`
  width: 100%;
  flex: 1;
  margin-top: 5px;
`;

const PageTitle = styled.div.attrs({
  placeholder: '제목 없음',
})`
  width: 100%;
  margin-top: 100px;
  color: rgb(55, 53, 47);
  font-weight: 700;
  line-height: 1.2;
  font-size: 40px;
  padding: 3px;

  &:focus {
    outline: none;
  }

  &:empty::before {
    content: attr(placeholder);
    color: #e1e1e0;
  }

  &:empty:focus::before {
    content: '';
  }
`;
