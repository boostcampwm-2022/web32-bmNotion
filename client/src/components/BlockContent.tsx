import React, { Dispatch, ReactElement, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Modal from '@/components/modal/Modal';
import BlockodalContent from '@/components/modal/BlockodalContent';

interface BlockContentProps {
  blockId: number;
  newBlock: Function;
  changeBlock: Function;
  index: number;
  content?: string;
  children?: any;
  ref?: any;
  type: string;
}

interface BlockContentBoxProps {
  placeholder: string;
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
    regExp: /^[0-9]+.$/,
    getType: (text: string) => 'OL' + text.slice(0, text.length - 1),
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
  children,
  blockId,
  newBlock,
  changeBlock,
  index,
  ref,
  type,
}: BlockContentProps): ReactElement {
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const handleBlockBarModal = () => {
    setBlockModalOpen(!blockModalOpen);
  };
  // const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const handleOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.shiftKey) {
      /* 블록 내에서 줄바꿈 반영 */
      e.stopPropagation();
    } else {
      /* 하단에 새로운 블록 생성 */
      e.preventDefault();
      /* TODO: 새로운 블록 생성하는 로직추가 */
      newBlock({ type: decisionNewBlockType(type), content: '', index: index + 1 });
    }
  };
  const handleOnSpace = (e: React.KeyboardEvent<HTMLDivElement>) => {
    /* 현재 카렛 위치 기준으로 text 분리 */
    const elem = e.target as HTMLElement;
    const content = elem.textContent || '';
    const offset = (window.getSelection() as Selection).focusOffset;
    const [preText, postText] = [content.slice(0, offset), content.slice(offset)];

    /* 마크다운 문법과 일치 => 해당 타입으로 변경 */
    const toType = checkMarkDownGrammer(preText);
    if (toType !== '') {
      /* toType으로 타입변경 */
      elem.textContent = postText;
      e.preventDefault();
      console.log(`toType => ${toType}`); /* TODO toType으로 타입변경하는 함수로 변경 필요 */
      changeBlock({ blockId, type: toType, content: postText });
    }
    // console.log('스페이스 눌린 타이밍에서 컨텐츠의 값음', `|${(e.target as any).textContent}|`);
  };
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Enter') {
      handleOnEnter(e);
    } else if (e.code === 'Space') {
      handleOnSpace(e);
    }
  };

  return (
    <BlockContainer>
      <BlockButtonBox>
        <BlockPlusButton onClick={handleBlockBarModal} />
        <BlockOptionButton />
      </BlockButtonBox>
      <BlockContentBox
        // type => css
        contentEditable
        onKeyDown={handleOnKeyDown}
      ></BlockContentBox>
      {blockModalOpen && (
        <Modal width={'324px'} height={'336px'} position={['30px', '', '', '44px']}>
          <BlockodalContent />
        </Modal>
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

const BlockOptionButton = styled.button`
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

const BlockContentBox = styled.div.attrs({
  placeholder: 'hello',
})<BlockContentBoxProps>`
  height: auto;
  flex: 1;
  background-color: lightgray;
  margin: 3px 2px;
  caret-color: red; // 커서 색깔,요하면 원하는 색깔로 바꾸기

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
