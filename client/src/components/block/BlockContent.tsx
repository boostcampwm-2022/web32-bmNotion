import React, { Dispatch, ReactElement, useState, useRef, useLayoutEffect, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Modal from '@/components/modal/Modal';
import BlockModalContent from '@/components/modal/BlockModalContent';
import BlockOptionModalContent from '@/components/modal/BlockOptionModalContent';
import { render } from 'react-dom';
import DimdLayer from '@/components/modal/DimdLayer';
import axios, { AxiosResponse } from 'axios';
import { axiosPostRequest } from '@/utils/axios.request';

interface BlockInfo {
  blockId: number;
  content: string;
  index: number;
  type: string;
  focus?: boolean;
}

interface BlockContentProps {
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

export default function BlockContent({
  block,
  newBlock,
  changeBlock,
  deleteBlock,
  type,
  provided,
  moveBlock,
  storePageTrigger,
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
        newBlock({ blockId, type: decisionNewBlockType(type), content: '', index: index + 1 });
      }
    }
  };
  const handleOnSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    /* 현재 카렛 위치 기준으로 text 분리 */
    const elem = e.target as HTMLElement;
    console.log('텍스트 비교', block.content, ' vs ', elem.textContent);
    const totalContent = elem.textContent || '';
    const offset = (window.getSelection() as Selection).focusOffset;
    const [preText, postText] = [totalContent.slice(0, offset), totalContent.slice(offset)];
    // console.log('🚀 ~ file: BlockContent.tsx ~ line 111 ~ handleOnSpace ~ preText', preText);
    /* 마크다운 문법과 일치 => 해당 타입으로 변경 */
    const toType = checkMarkDownGrammer(preText);
    if (toType !== '') {
      /* toType으로 타입변경 */
      e.preventDefault();
      elem.textContent = postText;
      console.log(`toType => ${toType}, content: ${postText}`);
      changeBlock({ blockId, type: toType, content: postText, index });
    }
    // console.log('스페이스 눌린 타이밍에서 컨텐츠의 값음', `|${(e.target as any).textContent}|`);
  };

  const handleOnArrow = (e: React.KeyboardEvent<HTMLDivElement>) => {
    moveBlock({ e, content: '', index: index });
  };

  const handleOnBackspace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const elem = e.target as HTMLElement;
    // console.log('🚀 ~ file: BlockContent.tsx ~ line 136 ~ handleOnBackspace ~ elem', elem);
    // console.log(elem.textContent, type);
    if ((window.getSelection() as Selection).focusOffset !== 0) return;
    if (type !== 'TEXT') {
      e.preventDefault();
      console.log('블록 TEXT로 변경');
      const toType = 'TEXT';
      changeBlock({ blockId, type: toType, content: elem.textContent, index });
    } else if (elem.textContent === '') {
      e.preventDefault();
      console.log('블록 삭제 트리거');
      deleteBlock({ block });
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleOnEnter(e);
    } else if (e.code === 'Space') {
      handleOnSpace(e);
    } else if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      handleOnArrow(e);
    } else if (e.code == 'Backspace') {
      handleOnBackspace(e);
    }
  };

  const handlePlus = (toType: string) => {
    setBlockPlusModalOpen(false);
    setBlockOptionModalOpen(false);
    if (!content && type === 'TEXT') {
      handleType(toType);
    } else {
      newBlock({ blockId, type: toType, content: '', index: index + 1 });
    }
  };
  const handleType = (toType: string) => {
    setBlockPlusModalOpen(false);
    setBlockOptionModalOpen(false);
    changeBlock({ blockId, type: toType, content: block.content, index });
  };

  const handleOnInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    target.normalize();
    const newContent = target.textContent;
    // console.log('🚀 ~ file: BlockContent.tsx ~ line 134 ~ handleOnInput ~ newContent', newContent);
    if (newContent !== null) {
      block.content = newContent;
      storePageTrigger({ isDelay: true });
    }
  };

  const handleOnPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const apiUrl = '/api/block/image';
    const headers = { 'Content-Type': 'application/octet-stream' };

    const getOnSuccess = (blockId: number, index: number) => (response: AxiosResponse<any, any>) => {
      changeBlock({ blockId, type: 'IMG', content: response.data.url, index})
    };
    
    const onFail = (err: AxiosResponse<any, any>) => console.error(err);

    const clipboardData = e.clipboardData;
    
    console.log('🚀 ~ file: Test.tsx:7 ~ handleOnPaste ~ clipboardData', clipboardData);

    if (clipboardData && clipboardData.files.length > 0) {
      const file = clipboardData.files[0];
      console.log("🚀 ~ file: BlockContent.tsx:212 ~ handleOnPaste ~ file", file)
      if (/image/.test(file.type)) {
        e.preventDefault();
        const newBlockId = newBlock({ blockId, type: 'image', content: '', index: index + 1 });
        const onSuccess = getOnSuccess(newBlockId, index + 1);
        axiosPostRequest(apiUrl, onSuccess, onFail, file, headers);
      }
    }
  };

  const beforeContent = block.type === 'UL' ? '•' : block.type === 'OL' ? '4242.' : '';
  return (
    <BlockContainer ref={provided.innerRef} {...provided.draggableProps}>
      <BlockButtonBox>
        <BlockPlusButton onClick={handleBlockPlusButtonModal} />
        <BlockOptionButton {...provided.dragHandleProps} onClick={handleBlockOptionButtonModal} />
      </BlockButtonBox>
      {beforeContent !== '' && <BeforeContentBox beforeContent={beforeContent} />}
      <BlockContentBox
        // type => css
        contentEditable
        className="content"
        onKeyDown={handleOnKeyDown}
        onInput={handleOnInput}
        onPaste={handleOnPaste}
        data-blockid={blockId}
        data-index={index}
        data-tab={1}
        ref={refBlock}
      >
        {block.type === 'IMG' ? <img src={block.content || ''} onError={(e:any) => e.target.src = "/assets/icons/camera.png" }></img> : content || ''}
      </BlockContentBox>
      {blockPlusModalOpen && (
        <>
          <DimdLayer onClick={handleBlockPlusButtonModal}></DimdLayer>
          <Modal width={'324px'} height={'336px'} position={['', '', '-336px', '44px']}>
            <BlockModalContent handleType={handlePlus} />
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
  background-color: lightgray;
  margin: 3px 2px;
  /* caret-color: red; // 커서 색깔,요하면 원하는 색깔로 바꾸기 */

  &:focus {
    outline: none;
  }

  white-space: pre-wrap;
  word-break: break-word;
`;

// &::before {
//   /* content: ${(props) => props['data-before-content']}; */
//   /* margin: 0 10px; */
//   /* color: #9b9a97; */
// }
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

const BeforeContentBox = styled.div<{ beforeContent: string }>`
  display: flex;
  align-content: center;
  align-items: center;
  &::before {
    content: '${(props) => props.beforeContent}';
  }
`;
