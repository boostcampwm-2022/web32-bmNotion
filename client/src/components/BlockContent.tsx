import React, { Dispatch, ReactElement, useState } from 'react';
import styled from 'styled-components';

interface BlockContentProps {
  blockId: number;
  content?: string;
  children?: any;
  moveNextBlock: Function;
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
const markdownGrammer: MarkdownGrammers = {
  HEADER: {
    regExp: /^#{1,3}$/,
    getType: (text: string) => 'H' + `${text.length}`
  },
  UNORDEREDLIST: {
    regExp: /^-$/,
    getType: (text: string) => 'UL'
  },
  ORDEREDLIST: {
    regExp: /^[0-9]+.$/,
    getType: (text: string) => 'OL' + text.slice(0, text.length - 1)
  },
}

const checkMarkDownGrammer = (text: string) => {
  const matched = Object.values(markdownGrammer).find(
    (({ regExp }) => regExp.test(text)))
  return matched === undefined ? '' : matched.getType(text);
};

export default function BlockContent({ children, blockId }: BlockContentProps): ReactElement {
  // const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  const handleOnEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.shiftKey) {
      /* 블록 내에서 줄바꿈 반영 */
      e.stopPropagation();
    } else {
      /* 하단에 새로운 블록 생성 */
      e.preventDefault();
      /* TODO: 새로운 블록 생성하는 로직추가 */
    }
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
    <BlockContentBox
      // type => css
      contentEditable
      onKeyDown={handleOnKeyDown}
    ></BlockContentBox>
  );
}

const BlockContentBox = styled.div.attrs({
  placeholder: 'hello',
})<BlockContentBoxProps>`
  &:empty::before {
    content: attr(placeholder);
    margin: 0 10px;
    color: #9b9a97;
  }
  &:empty:focus::before {
    content: '';
  }
  background-color: lightgray;
  margin: 3px 2px;
  caret-color: red; // 커서 색깔,요하면 원하는 색깔로 바꾸기

  &:focus {
    outline: none;
  }

  white-space: pre-wrap;
  word-break: break-word;
`;
