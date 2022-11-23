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
      console.log(`toType => ${toType}`);/* TODO toType으로 타입변경하는 함수로 변경 필요 */
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
    <BlockContentBox
      // type => css
      contentEditable
      onKeyDown={handleOnKeyDown}
      onInput={(e) => {
        /* 디버깅용 */ console.log(`|${(e.target as Node).textContent}|`);
      }}
    ></BlockContentBox>
  );
}

const BlockContentBox = styled.div.attrs({
  placeholder: 'hello',
}) <BlockContentBoxProps>`
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
