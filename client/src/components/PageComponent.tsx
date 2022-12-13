import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  createdAt: string;
}

interface PageInfo {
  title: string;
  nextId: string;
  pageId: string;
  blocks: BlockInfo[];
}

interface CreateBlockParam {
  prevBlockId?: string;
  index: number;
  content: string;
  type: string;
  notSaveOption?: boolean;
  callBack?: (page: PageInfo) => void;
}

interface AddBlockParam {
  block: BlockInfo;
  prevBlockId: string | undefined;
  callBack?: (page: PageInfo) => void;
}

interface ChangeBlockInfo {
  blockId: string;
  content?: string;
  index?: number;
  type?: string;
  createdAt?: string;
}

interface ChangeBlockParam {
  block: ChangeBlockInfo;
  notSaveOption?: boolean;
  callBack?: (page: PageInfo) => void;
}

interface DeleteBlockParam {
  blockId: string;
  notSaveOption?: boolean;
  callBack?: (page: PageInfo) => void;
}

interface EditInfo {
  blockId: string;
  task: 'create' | 'edit' | 'delete';
  content: string;
  index: number;
  type: string;
  createdAt: string;
  prevBlockId?: string;
}

interface BlockTask {
  blockId: string;
  task: 'create' | 'edit' | 'delete';
  prevBlockId?: string;
}

interface CaretPosition {
  targetBlockId: string | null;
  caretOffset: number | null;
}

const emptyPage = { title: '', nextId: '', pageId: '', blocks: [] } as PageInfo;
const caretPosition: CaretPosition = { targetBlockId: null, caretOffset: null };

export default function PageComponent({ selectedBlockId }: PageComponentProps): React.ReactElement {
  const [pageInfo, setPageInfo] = useState<PageInfo>(emptyPage);

  const [focusBlockId, setFocusBlockId] = useState<string | null>(null);

  const [editTasks, setEditTasks] = useState<BlockTask[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<BlockInfo[]>([]);

  const navigate = useNavigate();
  const [clientId] = useAtom(userIdAtom);
  const { pageid } = useParams();
  let isUploading = false;

  const addTask = (blockId: string, task: 'create' | 'edit' | 'delete', prevBlockId?: string) =>
    setEditTasks((prevTasks) => {
      const newTask =
        prevBlockId === undefined ? { blockId, task } : { blockId, task, prevBlockId };
      prevTasks.push(newTask);
      return prevTasks;
    });

  const getIndexByPrevId = ({
    prevBlockId,
    blocks,
  }: {
    prevBlockId: string;
    blocks: BlockInfo[];
  }) => {
    const prevBlock = blocks.find((block) => block.blockId === prevBlockId);
    if (prevBlock === undefined) return;
    return prevBlock.index + 1;
  };

  const updateIndex = (diff: number, targetIndex: number) => (block: BlockInfo, index: number) => {
    if (block.index < targetIndex) return block;
    const newIndex = index + diff;
    if (newIndex !== block.index)
      setEditTasks((prev) => [...prev, { blockId: block.blockId, task: 'edit' }]);
    return {
      ...block,
      index: newIndex,
    };
  };

  const createBlock = ({
    prevBlockId,
    index,
    content,
    type,
    notSaveOption,
    callBack,
  }: CreateBlockParam) => {
    setPageInfo((prevPage) => {
      const targetIndex =
        prevBlockId === undefined
          ? index
          : getIndexByPrevId({ prevBlockId, blocks: prevPage.blocks });
      if (targetIndex === undefined) return prevPage;
      const newBlocks = prevPage.blocks.map(updateIndex(1, targetIndex));
      const newBlock = {
        blockId: prevPage.nextId,
        content,
        index: targetIndex,
        type,
        createdAt: new Date().toUTCString(),
      };
      newBlocks.push(newBlock);
      newBlocks.sort((a, b) => a.index - b.index);
      if (notSaveOption !== true) addTask(prevPage.nextId, 'create', prevBlockId);
      if (callBack !== undefined) callBack(prevPage);
      return {
        ...prevPage,
        blocks: newBlocks,
        nextId: uuid(),
      };
    });
    return pageInfo.nextId;
  };

  const getFirstAddedIndex = (createdAt: string, index: number, blocks: BlockInfo[]): number => {
    const target = blocks[index];
    if (target === undefined) return index;
    return Date.parse(blocks[index].createdAt) > Date.parse(createdAt)
      ? getFirstAddedIndex(createdAt, index + 1, blocks)
      : index;
  };

  const getTargetIndex = ({
    block,
    prevBlockId,
    blocks,
  }: {
    block: BlockInfo;
    prevBlockId: string | undefined;
    blocks: BlockInfo[];
  }) => {
    if (prevBlockId === undefined) {
      if (block.index !== 0) return;
      return getFirstAddedIndex(block.createdAt, 0, blocks);
    }
    const prevBlock = blocks.find((block) => block.blockId === prevBlockId);
    if (prevBlock === undefined) return block.index;
    const originIndex = prevBlock.index + 1;
    return originIndex === blocks.length
      ? originIndex
      : getFirstAddedIndex(block.createdAt, originIndex, blocks);
  };

  const addBlock = ({ block, prevBlockId, callBack }: AddBlockParam) => {
    setPageInfo((prevPage) => {
      const targetIndex = getTargetIndex({
        prevBlockId,
        block,
        blocks: prevPage.blocks,
      });
      if (targetIndex === undefined) return prevPage;
      block.index = targetIndex;
      const newBlocks = prevPage.blocks.map(updateIndex(1, targetIndex));
      newBlocks.push(block);
      newBlocks.sort((a, b) => a.index - b.index);
      if (callBack !== undefined) callBack(prevPage);
      return {
        ...prevPage,
        blocks: newBlocks,
      };
    });
    return block.blockId;
  };

  const changeBlock = ({ block: targetBlock, notSaveOption, callBack }: ChangeBlockParam) => {
    setPageInfo((prevPage) => {
      if (notSaveOption !== true) addTask(targetBlock.blockId, 'edit');
      if (callBack !== undefined) callBack(prevPage);
      return {
        ...prevPage,
        blocks: prevPage.blocks
          .map((block) =>
            block.blockId === targetBlock.blockId ? { ...block, ...targetBlock } : block,
          )
          .sort((a, b) => a.index - b.index),
      };
    });
    return targetBlock.blockId;
  };

  const deleteBlock = ({ blockId, notSaveOption, callBack }: DeleteBlockParam) => {
    setPageInfo((prevPage) => {
      const newBlocks = prevPage.blocks
        .filter((block) => block.blockId !== blockId)
        .map(updateIndex(0, 0));
      if (notSaveOption !== true) setEditTasks((prev) => [...prev, { blockId, task: 'delete' }]);
      if (callBack !== undefined) callBack(prevPage);
      return {
        ...prevPage,
        blocks: newBlocks,
      };
    });
    return blockId;
  };

  const handleSetCaretPositionById = ({
    targetBlockId,
    caretOffset,
  }: {
    targetBlockId: string;
    caretOffset: number;
  }) => {
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
    const targetBlock = pageInfo.blocks.find((e) => e.index === targetBlockIndex);
    if (targetBlock === undefined) return;
    caretPosition.targetBlockId = targetBlock.blockId;
    caretPosition.caretOffset = caretOffset;
  };

  useEffect(() => {
    setSelectedBlocks(
      pageInfo.blocks.filter((e) => selectedBlockId.includes(e.blockId.toString())),
    );
  }, [selectedBlockId]);

  const filterTask = (blockTasks: BlockTask[]) => {
    const taskIds = {} as any;
    return blockTasks.reduce((pre, cur) => {
      const { task, blockId, prevBlockId } = cur;
      const target = pre[blockId];
      if (target === undefined) {
        pre[blockId] = [task, prevBlockId];
      } else {
        if (target === 'edit' && task === 'delete') pre[blockId][0] = 'delete';
        if (target === 'create' && task === 'delete') pre[blockId][0] = undefined;
      }
      return pre;
    }, taskIds);
  };

  const taskRequest = (filteredTask: Object, blocks: BlockInfo[]) => {
    const entries = Object.entries(filteredTask);
    return entries.map((value) => {
      const [blockId, taskArr] = value;
      const [task, prevBlockId] = taskArr;
      if (task === 'delete') {
        return { blockId: blockId, task };
      }
      const block = blocks.find((block) => block.blockId === blockId);
      if (block === undefined) return { blockId: blockId, task: 'delete' };
      return {
        task,
        prevBlockId,
        ...block,
      };
    });
  };

  const storePage = () => {
    isUploading = true;
    const editTasksTemp = editTasks.splice(0);
    const filteredTasks = filterTask(editTasksTemp);
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
      setEditTasks((prev) => [...editTasksTemp, ...prev]);
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
    const onServerConnect = (e: Event) => {};
    const onServerMsg = (e: MessageEvent) => {
      const { edits, userId, title } = JSON.parse(e.data) as {
        edits: EditInfo[];
        userId: string;
        title: string;
      };
      if (userId === clientId) return;
      pageInfo.title = title;
      edits.map((edit: EditInfo) => {
        const { task, blockId, type, content, index, createdAt, prevBlockId } = edit;
        switch (task) {
          case 'create':
            addBlock({ block: { blockId, content, createdAt, index, type }, prevBlockId });
            break;
          case 'edit':
            changeBlock({
              block: { blockId, content, index, type },
              notSaveOption: true,
            });
            break;
          case 'delete':
            deleteBlock({ blockId, notSaveOption: true });
            break;
          default:
            break;
        }
      });
    };
    const onServerError = (e: Event) => {};
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

  const moveCaret = (blockId: string, nowOffset: number) => {
    const blocks = document.querySelectorAll('div.content, div.title') as NodeListOf<HTMLElement>;
    if (!blocks) {
      return;
    } else {
      const target = [...blocks].find(
        (el) => el.getAttribute('data-blockid') === blockId,
      ) as HTMLElement;
      if (!target) return;
      let offset;
      if (target.textContent === null) {
        offset = 0;
      } else {
        if (target.textContent.length <= nowOffset) {
          offset = target.textContent.length;
        } else {
          offset = nowOffset;
        }
      }
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
    // if (pageInfo.blocks.length === 0) {
    //   return;
    // }
    if (caretPosition.targetBlockId === null || caretPosition.caretOffset === null) {
      return;
    }
    moveCaret(caretPosition.targetBlockId, caretPosition.caretOffset);
  }, [pageInfo]);

  useEffect(() => {
    const checkEdit = () => editTasks.length > 0;
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
    const accessToken = localStorage.getItem('jwt');
    if (accessToken === null) {
      navigate('/');
      return;
    }
    const requestHeader = {
      authorization: accessToken,
    };
    const onSuccess = (res: AxiosResponse) => {
      setPageInfo({
        title: res.data.title,
        nextId: uuid(),
        pageId: pageid as string,
        blocks: res.data.blocks.sort((a: BlockInfo, b: BlockInfo) => a.index - b.index),
      });
    };
    const onFail = (res: AxiosResponse) => {};
    axiosGetRequest(API.GET_PAGE + pageid, onSuccess, onFail, requestHeader);
  }, [pageid]);

  const handleOnInput = (e: React.FormEvent<HTMLDivElement>) => {
    const offset = (window.getSelection() as Selection).focusOffset;
    handleSetCaretPositionById({ targetBlockId: 'titleBlock', caretOffset: offset });
    if (!e.target) return;
    const newContent = (e.target as HTMLDivElement).textContent;
    if (newContent) {
      pageInfo.title = newContent;
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const elem = e.target as HTMLElement;
    if (!elem) return;
    const totalContent = elem.textContent || '';
    const offset = (window.getSelection() as Selection).focusOffset;
    const [preText, postText] = [totalContent.slice(0, offset), totalContent.slice(offset)];
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSetCaretPositionById({ targetBlockId: pageInfo.nextId, caretOffset: 0 });
      // if (caretPosition === null) {
      //   setCaretPosition({ targetBlockId: pageInfo.nextId, caretOffset: 0 });
      //   moveCaret(pageInfo.nextId, 0);
      //   return;
      // }
      // caretPosition.targetBlockId = pageInfo.nextId;
      // caretPosition.caretOffset = 0;

      // if(caretPosition === null) return ;
      // handleSetCaretPositionByIndex({targetBlockIndex: 1, caretOffset: 0});
      // caretPosition.targetBlockId = 1;
      // caretPosition.caretOffset = 0;
      if (e.nativeEvent.isComposing) return;
      if (totalContent.length === offset) {
        createBlock({
          prevBlockId: undefined,
          index: 0,
          content: '',
          type: 'TEXT',
        });
      } else {
        pageInfo.title = preText;
        elem.textContent = postText;
        createBlock({
          prevBlockId: undefined,
          index: 0,
          content: postText,
          type: 'TEXT',
        });
      }
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      const targetBlock = pageInfo.blocks.find((e) => e.index === 0);
      if (!targetBlock) return;
      moveCaret(targetBlock.blockId, offset);
    }
  };

  const onFocusIndex = (
    e: React.KeyboardEvent<HTMLDivElement>,
    targetIndex: string,
    offset: number,
  ) => {
    const blocks = document.querySelectorAll('div.content');
    const target = [...blocks].find(
      (el) => el.getAttribute('data-index') === targetIndex,
    ) as HTMLElement;
    if (!target) return;
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
    if (!target) return;
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
        if (index === 0) {
          e.preventDefault();
          moveCaret('titleBlock', offset);
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
      const target = [...contents].find((el) => el.getAttribute('data-blockid') === targetBlockId);
      if (target) {
        (target as any).tabIndex = -1;
        (target as any).focus();
        (target as any).tabIndex = 0;
      }
    };

    focusBlockId && onFocus(String(focusBlockId));
    // setFocusBlockId(null);
  }, [focusBlockId]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    setPageInfo((prev) => {
      const blocks = [...prev.blocks];
      const [reOrderedBlock] = blocks.splice(result.source.index - 1, 1);
      blocks.splice((result?.destination?.index as number) - 1, 0, reOrderedBlock);
      const arrayedBlocks = blocks.map((e, i) => {
        setEditTasks((prev) => [...prev, { blockId: e.blockId, task: 'edit' }]);
        return { ...e, index: i + 1 };
      });
      return { ...prev, blocks: arrayedBlocks };
    });
  };
  return (
    <>
      <PageTitle
        className="title"
        data-blockid="titleBlock"
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
                        createBlock={createBlock}
                        changeBlock={changeBlock}
                        moveBlock={moveBlock}
                        deleteBlock={deleteBlock}
                        index={block.index}
                        type={block.type}
                        provided={provided}
                        selectedBlocks={selectedBlocks}
                        allBlocks={pageInfo.blocks}
                        task={editTasks}
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
