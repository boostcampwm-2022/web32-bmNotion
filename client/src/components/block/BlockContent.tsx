import React, { Dispatch, ReactElement, useState, useRef, useLayoutEffect, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Modal from '@/components/modal/Modal';
import BlockModalContent from '@/components/modal/BlockModalContent';
import BlockOptionModalContent from '@/components/modal/BlockOptionModalContent';
import DimdLayer from '@/components/modal/DimdLayer';
import { AxiosResponse } from 'axios';
import { axiosPostRequest } from '@/utils/axios.request';

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

interface BlockContentProps {
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

interface BlockContentBoxProps {
  placeholder: string;
  blockId: number;
}

interface MarkdownGrammers {
  [index: string]: MarkdownGrammer;
}

interface MarkdownGrammer {
  regExp: RegExp;
  getType: (text: string) => string;
}

// interface BlockInfo {
//   blockId: number;
//   content: string;
//   index: number;
// }

const markdownGrammer: MarkdownGrammers = {
  HEADER: {
    regExp: /^#{1,3}$/,
    getType: (text: string) => 'H' + `${text.length}`,
  },
  UNORDEREDLIST: {
    regExp: /^-$/,
    getType: (text: string) => 'UL',
  },
  ORDEREDLIST: {
    regExp: /^[0-9]+\.$/,
    getType: (text: string) => 'OL',
  },
};

const decisionNewBlockType = (prevType: string) => {
  if (['UL', 'OL'].includes(prevType)) return prevType;
  return 'TEXT';
  // return prevType;
};

const checkMarkDownGrammer = (text: string) => {
  const matched = Object.values(markdownGrammer).find(({ regExp }) => regExp.test(text));
  return matched === undefined ? '' : matched.getType(text);
};

const splitTextContentByCaret = (elem: HTMLElement) => {
  const totalContent = elem.textContent || '';
  const offset = (window.getSelection() as Selection).focusOffset;
  return [totalContent.slice(0, offset), totalContent.slice(offset)];
};

export default function BlockContent({
  block,
  createBlock,
  changeBlock,
  deleteBlock,
  type,
  provided,
  moveBlock,
  selectedBlocks,
  allBlocks,
  pageInfo,
  handleSetCaretPositionById,
  handleSetCaretPositionByIndex,
  task,
}: BlockContentProps): ReactElement {
  const { blockId, content, index } = block;
  const [blockPlusModalOpen, setBlockPlusModalOpen] = useState(false);
  const [blockOptionModalOpen, setBlockOptionModalOpen] = useState(false);
  const refBlock = useRef<HTMLDivElement>(null);

  const handleBlockPlusButtonModal = () => {
    setBlockPlusModalOpen(!blockPlusModalOpen);
    setBlockOptionModalOpen(false);
  };
  const handleBlockOptionButtonModal = () => {
    setBlockOptionModalOpen(!blockOptionModalOpen);
    setBlockPlusModalOpen(false);
  };

  const handleOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.shiftKey) {
      /* 블록 내에서 줄바꿈 반영 */
      e.stopPropagation();
    } else {
      /* 하단에 새로운 블록 생성 */
      e.preventDefault();
      if (!e.nativeEvent.isComposing) {
        /* 한글 입력시 isComposing이 false일때만 실행 */
        const elem = e.target as HTMLElement;
        const totalContent = elem.textContent || '';
        const offset = (window.getSelection() as Selection).focusOffset;
        const [preText, postText] = [totalContent.slice(0, offset), totalContent.slice(offset)];
        elem.textContent = preText;
        block.content = preText;
        const handleCaret = (page: PageInfo) => {
          handleSetCaretPositionById({ targetBlockId: page.nextId, caretOffset: 0 });
        };
        task.push({ blockId: block.blockId, task: 'edit' });
        createBlock({
          prevBlockId: blockId,
          index: index + 1,
          type: decisionNewBlockType(type),
          content: postText,
          callBack: handleCaret,
        });
      }
    }
  };

  const handleOnSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    /* 현재 카렛 위치 기준으로 text 분리 */
    const elem = e.target as HTMLElement;
    const totalContent = elem.textContent || '';
    const offset = (window.getSelection() as Selection).focusOffset;
    const [preText, postText] = [totalContent.slice(0, offset), totalContent.slice(offset)];
    /* 마크다운 문법과 일치 => 해당 타입으로 변경 */
    const toType = checkMarkDownGrammer(preText);
    if (toType !== '') {
      /* toType으로 타입변경 */
      e.preventDefault();
      elem.textContent = postText;
      const handleCaret = () => {
        handleSetCaretPositionById({ targetBlockId: blockId, caretOffset: 0 });
      };
      changeBlock({ block: { ...block, type: toType, content: postText }, callBack: handleCaret });
    }
  };

  const handleOnArrow = (e: React.KeyboardEvent<HTMLDivElement>) => {
    moveBlock({ e, content: '', index: index, blockId: blockId });
  };

  const handleOnBackspace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const elem = e.target as HTMLElement;
    if ((window.getSelection() as Selection).focusOffset !== 0) return;
    if (type !== 'TEXT') {
      e.preventDefault();
      const toType = 'TEXT';
      const handleCaret = () => {
        handleSetCaretPositionById({ targetBlockId: blockId, caretOffset: 0 });
      };
      changeBlock({
        block: { ...block, type: toType, content: elem.textContent || '' },
        callBack: handleCaret,
      });
    } else {
      if (index === 0) {
        e.preventDefault();
        const titleDomBlock = document.querySelector('div.title') as HTMLElement;
        if (!titleDomBlock) return;
        const text = titleDomBlock.textContent || '' + elem.textContent || '';
        titleDomBlock.textContent = text;
        handleSetCaretPositionById({
          targetBlockId: 'titleBlock',
          caretOffset: pageInfo.title.length,
        });
        pageInfo.title = text;
        deleteBlock({ blockId });
        return;
      }

      const blocks = document.querySelectorAll('div.content');
      const prevDomBlock = [...blocks].find(
        (el) => el.getAttribute('data-index') === (index - 1).toString(),
      ) as HTMLElement;
      if (!prevDomBlock) return;
      const prevBlock = allBlocks.find((e) => e.index === index - 1);
      e.preventDefault();
      const text = (prevDomBlock.textContent as string) + elem.textContent || '';
      prevDomBlock.textContent = text;
      const handleCaret = () => {
        handleSetCaretPositionById({
          targetBlockId: prevBlock?.blockId,
          caretOffset: prevBlock?.content.length,
        });
      };
      if (prevBlock !== undefined)
        changeBlock({
          block: { ...prevBlock, content: text },
          callBack: handleCaret,
        });
      deleteBlock({ blockId });
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleOnEnter(e);
    } else if (e.code === 'Space') {
      handleOnSpace(e);
    } else if (
      e.code === 'ArrowUp' ||
      e.code === 'ArrowDown' ||
      e.code === 'ArrowLeft' ||
      e.code === 'ArrowRight' ||
      e.code === 'ShiftLeft'
    ) {
      handleOnArrow(e);
    } else if (e.code == 'Backspace') {
      handleOnBackspace(e);
    }
  };

  const handlePlus = (targetBlock: BlockInfo, toType: string) => {
    setBlockPlusModalOpen(false);
    setBlockOptionModalOpen(false);
    if (!content && type === 'TEXT') {
      handleType(targetBlock, toType);
    } else {
      createBlock({
        prevBlockId: targetBlock.blockId,
        index: index + 1,
        type: toType,
        content: '',
      });
    }
  };

  const handleType = (targetBlock: BlockInfo, toType: string) => {
    setBlockPlusModalOpen(false);
    setBlockOptionModalOpen(false);
    changeBlock({
      block: { ...targetBlock, type: toType },
    });
  };

  const handleOnInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const offset = (window.getSelection() as Selection).focusOffset;
    handleSetCaretPositionById({ targetBlockId: blockId, caretOffset: offset });
    if (!target) return;
    target.normalize();
    const newContent = target.textContent;
    if (newContent !== null) {
      block.content = newContent;
      task.push({ blockId: block.blockId, task: 'edit' });
    }
  };

  const handleOnPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;

    if (clipboardData.files.length > 0) {
      const getOnSuccess = (blockId: string) => (response: AxiosResponse<any, any>) => {
        response?.data?.url &&
          changeBlock({ block: { blockId, type: 'IMG', content: response.data.url } });
      };
      const getOnFail = (blockId: string) => (err: AxiosResponse<any, any>) => {
        const failImageUrl = 'https://via.placeholder.com/150.png?text=Fail+to+load';
        console.error(err);
        changeBlock({ block: { blockId, type: 'IMG', content: failImageUrl } });
      };
      const apiUrl = `/api/block/image`;
      const headers = { 'Content-Type': 'application/octet-stream' };
      const file = clipboardData.files[0];
      if (/image/.test(file.type)) {
        let newImgBlockId: string;
        if (type === 'TEXT' && content === '') {
          /* 비어있는 Text 블록 => 현재 블록 체인지 */
          newImgBlockId = changeBlock({ block: { blockId, type: 'IMG', content: '', index } });
          createBlock({
            prevBlockId: blockId,
            index: index + 1,
            type: 'TEXT',
            content: '',
          });
        } else {
          /* 그외 블록 => 비어있는 Text 블록 => 현재 블록 체인지 */
          const createTrailingBlock = (page: PageInfo) => {
            createBlock({
              prevBlockId: page.nextId,
              index: index + 2,
              type: 'TEXT',
              content: '',
            });
          };
          newImgBlockId = createBlock({
            prevBlockId: blockId,
            index: index + 1,
            type: 'IMG',
            content: '',
            callBack: createTrailingBlock,
          });
        }
        axiosPostRequest(
          `${apiUrl}/${file.name}`,
          getOnSuccess(newImgBlockId),
          getOnFail(newImgBlockId),
          file,
          headers,
        );
      }
    } else if (clipboardData.getData('text') !== '') {
      const elem = e.target as HTMLElement;
      const [preText, postText] = splitTextContentByCaret(elem);
      const newTextContent = preText + clipboardData.getData('text') + postText;
      elem.normalize();
      changeBlock({
        block: { ...block, content: newTextContent },
        callBack: () =>
          handleSetCaretPositionById({
            targetBlockId: blockId,
            caretOffset: newTextContent.length - postText.length,
          }),
      });
    }
  };

  const beforeContent = block.type === 'UL' ? '•' : block.type === 'OL' ? '4242.' : '';

  return (
    <BlockContainer
      ref={provided.innerRef}
      {...provided.draggableProps}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <BlockButtonBox>
        <BlockPlusButton onClick={handleBlockPlusButtonModal} />
        <BlockOptionButton {...provided.dragHandleProps} onClick={handleBlockOptionButtonModal} />
      </BlockButtonBox>
      {beforeContent !== '' && <BeforeContentBox beforeContent={beforeContent} />}
      <BlockContentBox
        // type => css
        contentEditable={type === 'IMG' ? false : true}
        suppressContentEditableWarning={true}
        className="content"
        onKeyDown={handleOnKeyDown}
        onInput={handleOnInput}
        onPaste={handleOnPaste}
        data-blockid={blockId}
        data-index={index}
        data-tab={1}
        ref={refBlock}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={() => {
          const selection = window.getSelection() as Selection;
          const offset = selection.focusOffset;
          handleSetCaretPositionById({ targetBlockId: blockId, caretOffset: offset });
        }}
      >
        {block.type === 'IMG' ? (
          <img
            src={block.content || ''}
            onError={(e: any) => (e.target.src = '/assets/icons/camera.png')}
          ></img>
        ) : (
          content || ''
        )}
      </BlockContentBox>
      {blockPlusModalOpen && (
        <>
          <DimdLayer onClick={handleBlockPlusButtonModal}></DimdLayer>
          <Modal width={'324px'} height={'336px'} position={['', '', '-336px', '44px']}>
            <BlockModalContent block={block} handleType={handlePlus} />
          </Modal>
        </>
      )}
      {blockOptionModalOpen && (
        <>
          <DimdLayer onClick={handleBlockOptionButtonModal}></DimdLayer>
          <Modal width={'265px'} height={'84px'} position={['', '', '-84px', '44px']}>
            <BlockOptionModalContent
              deleteBlock={deleteBlock}
              block={block}
              handleType={handleType}
              selectedBlocks={selectedBlocks}
              handleBlockOptionButtonModal={handleBlockOptionButtonModal}
            />
          </Modal>
        </>
      )}
    </BlockContainer>
  );
}

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const BlockButtonBox = styled.div`
  visibility: hidden;
  display: flex;
  width: 42px;
  height: 24px;
  margin: 3px 0px;
`;

const BlockPlusButton = styled.button`
  background-image: url('/assets/icons/plusButton.png');
  background-repeat: no-repeat;
  background-size: 14px 14px;
  background-position: center;
  width: 24px;
  height: 24px;
  border-radius: 3px;

  &:hover {
    background-color: #ebebea;
  }
`;

const BlockOptionButton = styled.div`
  cursor: pointer;
  width: 18px;
  height: 24px;
  background-image: url('/assets/icons/optionButton.png');
  background-repeat: no-repeat;
  background-size: 8.4px 14px;
  background-position: center;
  border-radius: 3px;

  &:hover {
    background-color: #ebebea;
  }
`;

const BlockContainer = styled.div`
  display: flex;
  margin-left: -42px;
  width: 100%;
  position: relative;

  &:hover {
    ${BlockButtonBox} {
      visibility: visible;
      animation: ${fadeIn} 0.5s;
    }
  }
`;

// const BlockContentBox = styled.div<{ 'data-before-content': string }>`
const BlockContentBox = styled.div`
  height: auto;
  flex: 1;
  margin: 1px 2px;
  padding: 3px 2px;
  /* caret-color: red; // 커서 색깔,요하면 원하는 색깔로 바꾸기 */
  border-radius: 3px;
  transition: all 0.1s linear;

  &.selected {
    background-color: rgba(35, 131, 226, 0.15);
  }

  &:focus {
    outline: none;
  }

  white-space: pre-wrap;
  word-break: break-word;
`;

const BeforeContentBox = styled.div<{ beforeContent: string }>`
  display: flex;
  align-content: center;
  align-items: center;
  &::before {
    content: '${(props) => props.beforeContent}';
  }
`;
