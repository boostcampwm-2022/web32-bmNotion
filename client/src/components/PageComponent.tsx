import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import StyledBlockContent from '@/components/block/StyledBlockContent';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { API } from '@/config/config';
import { axiosGetRequest, axiosPostRequest } from '@/utils/axios.request';
import { AxiosResponse } from 'axios';
import { userIdAtom } from '@/store/userAtom';
import { useAtom } from 'jotai';
import { v4 as uuid } from 'uuid';

interface PageComponentProps {
  selectedBlockId: string[];
}
interface BlockInfo {
  blockId: string;
  content: string;
  index: number;
  type: string;
  focus?: boolean;
}

interface PageInfo {
  title: string;
  nextId: string;
  pageId: string;
  blocks: BlockInfo[];
}

interface EditInfo {
  blockId: string;
  task: string;
  content: string;
  index: number;
  type: string;
}

interface EditedBlockInfo {
  block: BlockInfo;
  type: 'new' | 'change' | 'delete';
}

interface BlockTask {
  blockId: string;
  task: string;
}

interface CaretPosition {
  targetBlockId: string;
  caretOffset: number;
}

export default function PageComponent({ selectedBlockId }: PageComponentProps): React.ReactElement {
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    title: '',
    nextId: '',
    pageId: '',
    blocks: [],
  });
  const [focusBlockId, setFocusBlockId] = useState<string | null>(null);
  const [editedBlock, setEditedBlock] = useState<EditedBlockInfo | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<BlockInfo[]>([]);
  const [blockTask, setBlockTask] = useState<BlockTask[]>([]);
  const [caretPosition, setCaretPosition] = useState<CaretPosition | null>(null);
  const [clientId] = useAtom(userIdAtom);

  const handleSetCaretPositionById = ({
    targetBlockId,
    caretOffset,
  }: {
    targetBlockId: string;
    caretOffset: number;
  }) => {
    if (caretPosition === null) return;
    caretPosition.targetBlockId = targetBlockId;
    caretPosition.caretOffset = caretOffset;
  };
  const handleSetCaretPositionByIndex = ({
    targetBlockIndex,
    caretOffset,
  }: {
    targetBlockIndex: number;
    caretOffset: number;
  }) => {
    console.log('targetBlockIndex :', targetBlockIndex);
    const targetBlock = pageInfo.blocks.find((e) => e.index === targetBlockIndex);
    if (targetBlock === undefined) return;
    if (caretPosition === null) {
      setCaretPosition({ targetBlockId: targetBlock.blockId, caretOffset: caretOffset });
      return;
    }
    caretPosition.targetBlockId = targetBlock.blockId;
    caretPosition.caretOffset = caretOffset;
  };

  // const [isUploading, setIsUploading] = useState(false);
  let isUploading = false;

  const { pageid } = useParams();

  useEffect(() => {
    setSelectedBlocks(
      pageInfo.blocks.filter((e) => selectedBlockId.includes(e.blockId.toString())),
    );
  }, [selectedBlockId]);

  const filterTask = (blockTasks: BlockTask[]) => {
    const taskIds = {} as any;
    return blockTasks.reduce((pre, cur) => {
      const { task, blockId } = cur;
      const target = pre[blockId];
      if (target === undefined) {
        if (task === 'create') {
          pre[blockId] = 'create';
        } else if (task === 'edit') {
          pre[blockId] = 'edit';
        } else if (task === 'delete') {
          pre[blockId] = 'delete';
        }
      } else {
        if (target === 'delete') {
          if (task === 'delete') {
            pre[blockId] = 'delete';
          } else if (task === 'edit') {
            pre[blockId] = 'edit';
          } else if (task === 'create') {
            pre[blockId] = 'edit';
          }
        } else if (target === 'edit') {
          if (task === 'delete') {
            pre[blockId] = 'delete';
          } else if (task === 'edit') {
            pre[blockId] = 'edit';
          } else if (task === 'create') {
            pre[blockId] = 'edit';
          }
        } else if (target === 'create') {
          if (task === 'delete') {
            pre[blockId] = undefined;
          } else if (task === 'edit') {
            pre[blockId] = 'create';
          } else if (task === 'create') {
            pre[blockId] = 'create';
          }
        }
      }
      return pre;
    }, taskIds);
  };

  const taskRequest = (filteredTask: Object, blocks: BlockInfo[]) => {
    const entries = Object.entries(filteredTask);
    return entries.map((value) => {
      const [blockId, task] = value;
      if (task === 'delete') {
        return { blockId: blockId, task };
      }
      const block = blocks.find((block) => block.blockId === blockId);
      if (block === undefined) return { blockId: blockId, task: 'delete' };
      return {
        blockId: blockId,
        task,
        content: block.content,
        index: block.index,
        type: block.type,
      };
    });
  };

  const storePage = () => {
    console.log('페이지 블록', pageInfo.blocks);
    isUploading = true;
    const blockTaskTemp = blockTask.slice(0);
    blockTask.splice(0);
    const filteredTasks = filterTask(blockTaskTemp);
    const tasks = taskRequest(filteredTasks, pageInfo.blocks);
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    const requestBody = {
      pageid,
      title: pageInfo.title,
      tasks,
    };
    const onSuccess = (res: AxiosResponse) => {
      isUploading = false;
    };
    const onFail = (res: AxiosResponse) => {
      setBlockTask((prev) => [...blockTaskTemp, ...prev]);
      isUploading = false;
    };
    axiosPostRequest(API.UPDATE_PAGE, onSuccess, onFail, requestBody, requestHeader);
  };

  // useEffect(() => {
  //   const handleStore = (e: KeyboardEvent) => {
  //     if (e.code === 'KeyS') {
  //       const isMac = /Mac/.test(window.clientInformation.platform);
  //       const commandKeyPressed = isMac ? e.metaKey === true : e.ctrlKey === true;
  //       if (commandKeyPressed === true) {
  //         e.preventDefault();
  //       }
  //     }
  //   };
  //   window.addEventListener('keydown', handleStore);
  //   return () => {
  //     window.removeEventListener('keydown', handleStore);
  //   };
  // }, [pageInfo, blockTask]);

  useEffect(() => {
    const source = new EventSource(API.CONNECT_SSE, {
      withCredentials: true,
    });
    const onServerConnect = (e: Event) => {
      //console.log('sse connection');
      // console.log(e);
    };
    const onServerMsg = (e: MessageEvent) => {
      const { edits, userId, title } = JSON.parse(e.data) as {
        edits: EditInfo[];
        userId: string;
        title: string;
      };
      if (userId === clientId) return;
      pageInfo.title = title;
      edits.map((edit: EditInfo) => {
        const { task, blockId, type, content, index } = edit;
        switch (task) {
          case 'create':
            addBlock({ blockId, type, content, index, noSave: true });
            break;
          case 'edit':
            changeBlock({ blockId, type, content, index, noSave: true });
            break;
          case 'delete':
            deleteBlock({ block: { blockId, type: '', content: '', index: 1 }, noSave: true });
            break;
          default:
            break;
        }
      });
    };
    const onServerError = (e: Event) => {
      // console.log('sse error');
      // console.log(e);
    };
    source.addEventListener('open', onServerConnect);
    source.addEventListener('message', onServerMsg);
    source.addEventListener('error', onServerError);

    return () => {
      source.removeEventListener('open', onServerConnect);
      source.removeEventListener('message', onServerMsg);
      source.removeEventListener('error', onServerError);
      source.close();
    };
  }, [pageid, pageInfo]);

  const moveCaret = (blockId: string, offset: number) => {
    const blocks = document.querySelectorAll('div.content') as NodeListOf<HTMLElement>;
    if (!blocks) {
      return;
    } else {
      const target = [...blocks].find(
        (el) => el.getAttribute('data-blockid') === blockId,
      ) as HTMLElement;
      const range = document.createRange();
      const select = window.getSelection();
      if (!target) return;
      if (target.childNodes.length === 0) {
        range.setStart(target, offset);
        range.collapse(true);

        select?.removeAllRanges();
        select?.addRange(range);
        return;
      }
      range.setStart(target.childNodes[0], offset);
      range.collapse(true);

      select?.removeAllRanges();
      select?.addRange(range);
    }
  };
  useEffect(() => {
    console.log('리렌더링');
    if (pageInfo.blocks.length === 0) {
      return;
    }
    if (caretPosition === null) return;
    moveCaret(caretPosition.targetBlockId, caretPosition.caretOffset);
  }, [pageInfo]);

  useEffect(() => {
    const checkEdit = () => blockTask.length > 0;
    const checkUploading = () => isUploading;
    const syncPage = () => {
      if (checkEdit() && !checkUploading()) {
        storePage();
      }
    };
    const id = setInterval(syncPage, 500);

    return () => {
      clearInterval(id);
    };
  }, [pageid, pageInfo]);

  useEffect(() => {
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    const onSuccess = (res: AxiosResponse) => {
      setPageInfo({
        title: res.data.title,
        nextId: uuid(),
        pageId: pageid as string,
        blocks: res.data.blocks.sort((a: BlockInfo, b: BlockInfo) => a.index - b.index),
      });
    };
    const onFail = (res: AxiosResponse) => {
      // console.log(res.data);
    };
    axiosGetRequest(API.GET_PAGE + pageid, onSuccess, onFail, requestHeader);
  }, [pageid]);

  const updateIndex = (diff: number) => (block: BlockInfo) => {
    setBlockTask((prev) => [...prev, { blockId: block.blockId, task: 'edit' }]);
    return {
      ...block,
      index: block.index + diff,
    };
  };

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
      if (caretPosition === null) {
        setCaretPosition({ targetBlockId: pageInfo.nextId, caretOffset: 0 });
        moveCaret(pageInfo.nextId, 0);
        return;
      }
      caretPosition.targetBlockId = pageInfo.nextId;
      caretPosition.caretOffset = 0;

      // if(caretPosition === null) return ;
      // handleSetCaretPositionByIndex({targetBlockIndex: 1, caretOffset: 0});
      // caretPosition.targetBlockId = 1;
      // caretPosition.caretOffset = 0;
      if (e.nativeEvent.isComposing) return;
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
    noSave,
  }: {
    blockId?: string;
    type: string;
    content: string;
    index: number;
    noSave?: boolean;
  }) => {
    if (!noSave) setBlockTask((prev) => [...prev, { blockId: pageInfo.nextId, task: 'create' }]);
    setPageInfo((prev) => {
      return {
        ...prev,
        blocks: [
          ...prev.blocks.slice(0, index - 1),
          { content, type, index, blockId: prev.nextId },
          ...(!noSave
            ? prev.blocks.slice(index - 1).map(updateIndex(1))
            : prev.blocks.slice(index - 1)),
        ].sort((a, b) => a.index - b.index),
        nextId: uuid(),
      };
    });
    return pageInfo.nextId;
  };

  const changeBlock = ({
    blockId,
    type,
    content,
    index,
    noSave,
  }: {
    blockId: string;
    type: string;
    content: string;
    index: number;
    noSave?: boolean;
  }) => {
    setPageInfo((prev) => {
      return {
        ...prev,
        blocks: prev.blocks
          .map((block) => (block.blockId === blockId ? { ...block, type, content, index } : block))
          .sort((a, b) => a.index - b.index),
      };
    });
    if (!noSave) setBlockTask((prev) => [...prev, { blockId, task: 'edit' }]);
    return blockId;
  };

  const deleteBlock = ({
    block: targetBlockInfo,
    noSave,
  }: {
    block: BlockInfo;
    noSave?: boolean;
  }) => {
    // console.log('delete ', targetBlockInfo.blockId);
    setPageInfo((prev) => {
      const targetIndex = prev.blocks.findIndex(
        (block) => block.blockId === targetBlockInfo.blockId,
      );
      if (targetIndex === -1) return prev;
      return {
        ...prev,
        blocks: [
          ...prev.blocks.slice(0, targetIndex),
          ...prev.blocks.slice(targetIndex + 1).map(updateIndex(-1)),
        ],
      } as PageInfo;
    });
    if (!noSave)
      setBlockTask((prev) => [...prev, { blockId: targetBlockInfo.blockId, task: 'delete' }]);
  };

  /* editedBlock */
  useEffect(() => {
    // console.log('🚀 ~ file: PageComponent.tsx:94 ~ PageComponent ~ editedBlock', editedBlock);
    if (!editedBlock || editedBlock.block === undefined) return;
    if (editedBlock.type === 'delete') {
      editedBlock !== undefined &&
        setPageInfo((prev) => {
          const targetBlock = prev.blocks.find(
            (block) => block.blockId === editedBlock.block.blockId,
          );
          if (targetBlock === undefined) return prev;
          const targetIndex = targetBlock.index;
          targetIndex - 1 !== 0 &&
            setFocusBlockId(
              pageInfo.blocks.find((block) => block.index === targetIndex - 1)?.blockId ?? null,
            );
          return {
            ...prev,
            blocks: [
              ...prev.blocks.slice(0, targetIndex - 1),
              ...prev.blocks.slice(targetIndex).map(updateIndex(-1)),
            ],
          } as PageInfo;
        });
    } else {
      const { blockId, content, index, type, focus } = editedBlock.block;
      setPageInfo((prev) => ({
        ...prev,
        blocks: [
          ...prev.blocks.slice(0, index - 1),
          { ...editedBlock.block, blockId: type === 'new' ? prev.nextId : blockId },
          ...prev.blocks.slice(index - 1).map(updateIndex(1)),
        ],
        nextId: type === 'new' ? uuid() : prev.nextId,
      }));
      // setFocusBlockId(blockId);
      // setCaretPosition({targetBlockId: blockId, caretOffset: 0});
    }
  }, [editedBlock]);

  const onFocusIndex = (
    e: React.KeyboardEvent<HTMLDivElement>,
    targetIndex: string,
    offset: number,
  ) => {
    const blocks = document.querySelectorAll('div.content');
    const target = [...blocks].find(
      (el) => el.getAttribute('data-index') === targetIndex,
    ) as HTMLElement;
    if (target.childNodes.length === 0) {
      target.focus();
      return;
    }
    handleCaretIndex(e, target, offset);
  };

  const handleCaretIndex = (
    e: React.KeyboardEvent<HTMLDivElement>,
    target: HTMLElement,
    offset: number,
  ) => {
    e.preventDefault();
    if (target.childNodes.length === 0) {
      return;
    }
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
    const target = e.target as HTMLElement;
    const lastLineLength = target.innerHTML.split('\n').slice(-1).join('').length;
    const firstLineLength = target.innerHTML.split('\n')[0].length;
    const baseLength = target.innerHTML.length - lastLineLength;
    if (target.innerHTML.includes('\n')) {
      if (e.code === 'ArrowUp' && offset <= firstLineLength) {
        //여러 line을 가진 block의 첫번쨰 줄일 경우
        onFocusIndex(e, String(index - 1), offset);
        return;
      } else if (
        //여러 line을 가진 block의 마지막 줄일 경우
        e.code === 'ArrowDown' &&
        baseLength < offset &&
        offset <= target.innerHTML.length
      ) {
        onFocusIndex(e, String(index + 1), offset - baseLength);
        return;
      }
      return;
    } else {
      if (e.code === 'ArrowUp') {
        if (index === 1) {
          return;
        }
        onFocusIndex(e, String(index - 1), offset);
        return;
      } else if (e.code === 'ArrowDown') {
        if (index === pageInfo.blocks[pageInfo.blocks.length - 1].index) {
          return;
        }
        onFocusIndex(e, String(index + 1), offset);
        return;
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
    // setFocusBlockId(null);
  }, [focusBlockId]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // console.log('res = ', result);

    setPageInfo((prev) => {
      const blocks = [...prev.blocks];
      const [reOrderedBlock] = blocks.splice(result.source.index - 1, 1);
      blocks.splice((result?.destination?.index as number) - 1, 0, reOrderedBlock);
      const arrayedBlocks = blocks.map((e, i) => {
        setBlockTask((prev) => [...prev, { blockId: e.blockId, task: 'edit' }]);
        return { ...e, index: i + 1 };
      });
      return { ...prev, blocks: arrayedBlocks };
    });
  };
  if (pageInfo === null) return <div>로딩중</div>;
  return (
    <>
      <PageTitle
        contentEditable
        onInput={handleOnInput}
        onKeyDown={handleOnKeyDown}
        suppressContentEditableWarning={true}
        onMouseDown={(e) => e.stopPropagation()}
      >
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
                      <StyledBlockContent
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
                        selectedBlocks={selectedBlocks}
                        allBlocks={pageInfo.blocks}
                        task={blockTask}
                        pageInfo={pageInfo}
                        handleSetCaretPositionById={handleSetCaretPositionById}
                        handleSetCaretPositionByIndex={handleSetCaretPositionByIndex}
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
