import React, { Dispatch, ReactElement, useState, useRef, useLayoutEffect, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Modal from '@/components/modal/Modal';
import BlockModalContent from '@/components/modal/BlockModalContent';
import { render } from 'react-dom';

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

interface BlockInfo {
  blockId: number;
  content: string;
  index: number;
}

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
};

const checkMarkDownGrammer = (text: string) => {
  const matched = Object.values(markdownGrammer).find(({ regExp }) => regExp.test(text));
  return matched === undefined ? '' : matched.getType(text);
};

export default function BlockContent({
  block,
  // children,
  // blockId,
  newBlock,
  changeBlock,
  index,
  type,
  provided,
  moveBlock,
}: BlockContentProps): ReactElement {
  const { blockId, content, index, type } = block;
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const refBlock = useRef<HTMLDivElement>(null);
  const handleBlockBarModal = () => {
    setBlockModalOpen(!blockModalOpen);
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
    console.log('🚀 ~ file: BlockContent.tsx ~ line 111 ~ handleOnSpace ~ preText', preText);
    /* 마크다운 문법과 일치 => 해당 타입으로 변경 */
    const toType = checkMarkDownGrammer(preText);
    if (toType !== '') {
      /* toType으로 타입변경 */
      e.preventDefault();
      console.log(`toType => ${toType}, content: ${postText}`);
      changeBlock({ blockId, type: toType, content: postText, index });
    }
    // console.log('스페이스 눌린 타이밍에서 컨텐츠의 값음', `|${(e.target as any).textContent}|`);
  };

  const handleOnArrow = (e: React.KeyboardEvent<HTMLDivElement>) => {
    moveBlock({ e, content: '', index: index });
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
      handleOnEnter(e);
    } else if (e.code === 'Space') {
      handleOnSpace(e);
    } else if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      handleOnArrow(e);
    }
  };
  const handleType = (type: string) => {
    setBlockModalOpen(false);
    changeBlock({ blockId, type: toType, content: block.content, index });
  };

  const handleOnInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = (e.target as HTMLDivElement).textContent;
    console.log('🚀 ~ file: BlockContent.tsx ~ line 134 ~ handleOnInput ~ newContent', newContent);
    if (newContent) {
      block.content = newContent;
    }
  };

  const renderTypeBlock = () => {
    if (type === 'H1') {
      return (
        <H1BlockContentBox>
          <BlockContainer>
            <BlockButtonBox>
              <BlockPlusButton onClick={handleBlockBarModal} />
              <BlockOptionButton />
            </BlockButtonBox>
            <BlockContentBox
              // type => css
              contentEditable
              className="content"
              onKeyDown={handleOnKeyDown}
              onInput={handleOnInput}
              data-blockid={blockId}
              data-index={index}
              ref={refBlock}
            >
              {block.content || ''}
            </BlockContentBox>
            {blockModalOpen && (
              <Modal width={'324px'} height={'336px'} position={['', '', '-336px', '44px']}>
                <BlockModalContent handleType={handleType} />
              </Modal>
            )}
          </BlockContainer>
        </H1BlockContentBox>
      );
    } else if (type === 'H2') {
      return (
        <H2BlockContentBox>
          <BlockContainer>
            <BlockButtonBox>
              <BlockPlusButton onClick={handleBlockBarModal} />
              <BlockOptionButton />
            </BlockButtonBox>
            <BlockContentBox
              // type => css
              contentEditable
              className="content"
              onKeyDown={handleOnKeyDown}
              onInput={handleOnInput}
              data-blockid={blockId}
              data-index={index}
              ref={refBlock}
            >
              {block.content || ''}
            </BlockContentBox>
            {blockModalOpen && (
              <Modal width={'324px'} height={'336px'} position={['', '', '-336px', '44px']}>
                <BlockModalContent handleType={handleType} />
              </Modal>
            )}
          </BlockContainer>
        </H2BlockContentBox>
      );
    } else if (type === 'H3') {
      return (
        <H3BlockContentBox>
          <BlockContainer>
            <BlockButtonBox>
              <BlockPlusButton onClick={handleBlockBarModal} />
              <BlockOptionButton />
            </BlockButtonBox>
            <BlockContentBox
              // type => css
              contentEditable
              className="content"
              onKeyDown={handleOnKeyDown}
              onInput={handleOnInput}
              data-blockid={blockId}
              data-index={index}
              ref={refBlock}
            >
              {block.content || ''}
            </BlockContentBox>
            {blockModalOpen && (
              <Modal width={'324px'} height={'336px'} position={['', '', '-336px', '44px']}>
                <BlockModalContent handleType={handleType} />
              </Modal>
            )}
          </BlockContainer>
        </H3BlockContentBox>
      );
    } else {
      return (
        <TextBlockContentBox>
          <BlockContainer ref={provided.innerRef} {...provided.draggableProps}>
            <BlockButtonBox>
              <BlockPlusButton onClick={handleBlockBarModal} />
              <BlockOptionButton onClick={() => console.log('aa')} {...provided.dragHandleProps} />
            </BlockButtonBox>
            <BlockContentBox
              // type => css
              contentEditable
              className="content"
              onKeyDown={handleOnKeyDown}
              onInput={handleOnInput}
              data-blockid={blockId}
              data-index={index}
              ref={refBlock}
            >
              {block.content || ''}
            </BlockContentBox>
            {blockModalOpen && (
              <Modal width={'324px'} height={'336px'} position={['', '', '-336px', '44px']}>
                <BlockModalContent handleType={handleType} />
              </Modal>
            )}
          </BlockContainer>
        </TextBlockContentBox>
      );
    }
  };
  return <>{renderTypeBlock()}</>;
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

const BlockContentBox = styled.div.attrs({})`
  height: auto;
  flex: 1;
  background-color: lightgray;
  margin: 3px 2px;
  /* caret-color: red; // 커서 색깔,요하면 원하는 색깔로 바꾸기 */

  &:focus {
    outline: none;
  }

  &:empty::before {
    content: ${(props) => props.placeholder || ''};
    margin: 0 10px;
    color: #9b9a97;
  }

  &:empty:focus::before {
    content: '';
  }

  white-space: pre-wrap;
  word-break: break-word;
`;

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
