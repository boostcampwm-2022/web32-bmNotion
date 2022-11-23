import React, { Dispatch, ReactElement, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Modal from '@/components/modal/Modal';
import BlockodalContent from '@/components/modal/BlockodalContent';

interface BlockContentProps {
  blockId: number;
  content?: string;
  children?: any;
  moveNextBlock: Function;
}

interface BlockContentBoxProps {
  placeholder: string;
}

export default function BlockContent({ children, blockId }: BlockContentProps): ReactElement {
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const handleBlockBarModal = () => {
    setBlockModalOpen(!blockModalOpen);
  };
  // const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const handleOnEnter = (e: any) => {
    if (e.shiftKey) {
      /* 블록 내에서 줄바꿈 반영 */
      // e.preventDefault() => 요게 있으면 줄이 바뀌는 현상이 일어나지 않는다.
      e.stopPropagation();
      var ev = new Event('keydown') as any;
      ev.keyCode = 13;
      ev.which = e.keyCode;
      (e as any).dispatchEvent(ev);
    } else {
      e.preventDefault();
    }
    return;
  };
  const handleOnSpace = (e: any) => {
    const offset = (window.getSelection() as Selection).focusOffset;
    const preText = e.target.textContent.slice(0, offset);
    const afterText = e.target.textContent.slice(offset);

    if (/^#{1,3}$/.test(preText)) {
      console.log(`H${preText.length}`, '로 타입을 변경하도록 합니다.');
      e.target.textContent = afterText;
      e.preventDefault();
    } else {
      console.log('아무일도 없었습니다.');
    }
    console.log('스페이스 눌린 타이밍에서 컨텐츠의 값음', `|${(e.target as any).textContent}|`);
  };

  const handleOnKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      handleOnEnter(e);
    } else if (e.keyCode === 32) {
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
  margin-left: -42px;
  display: flex;
  width: 100%;
  align-items: center;
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
  height: 24px;
  flex: 1;
  background-color: lightgray;
  margin: 3px 2px;
  caret-color: red; // 커서 색깔,요하면 원하는 색깔로 바꾸기

  &:focus {
    outline: none;
  }

  &:empty::before {
    content: attr(placeholder);
    margin: 0 10px;
    color: #9b9a97;
  }

  &:empty:focus::before {
    content: '';
  }

  white-space: pre-wrap;
  word-break: break-word;
`;
