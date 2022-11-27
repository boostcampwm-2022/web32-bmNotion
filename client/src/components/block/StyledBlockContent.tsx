import React, { Dispatch, ReactElement, useState } from 'react';
import styled from 'styled-components';
import BlockContent from '@/components/block/BlockContent';

interface BlockContentProps {
  blockId: number;
  newBlock: Function;
  changeBlock: Function;
  index: number;
  content?: string;
  children?: any;
  type: string;
}

export default function StyledBlockContent({
  blockId,
  newBlock,
  changeBlock,
  index,
  type,
}: BlockContentProps): ReactElement {
  const [nowType, setNowType] = useState(type);
  const handleNowType = (type:string)=> {
    setNowType(type);
  }
  const renderTypeBlock = () => {
    if (nowType === 'H1') {
      return (
        <H1BlockContentBox>
          <BlockContent           
          key={blockId}
          blockId={blockId}
          newBlock={newBlock}
          changeBlock={changeBlock}
          index={index}
          type={type}
          setNowType={handleNowType}
          />
        </H1BlockContentBox>
      );
    } else if (nowType === 'H2') {
      return (
        <H2BlockContentBox>
          <BlockContent           
          key={blockId}
          blockId={blockId}
          newBlock={newBlock}
          changeBlock={changeBlock}
          index={index}
          type={type}
          setNowType={handleNowType}
          />
        </H2BlockContentBox>
      );
    } else if (nowType === 'H3') {
      return (
        <H3BlockContentBox>
          <BlockContent           
          key={blockId}
          blockId={blockId}
          newBlock={newBlock}
          changeBlock={changeBlock}
          index={index}
          type={type}
          setNowType={handleNowType}
          />
        </H3BlockContentBox>
      );
    } else {
      return (
        <TextBlockContentBox>
          <BlockContent           
          key={blockId}
          blockId={blockId}
          newBlock={newBlock}
          changeBlock={changeBlock}
          index={index}
          type={type}
          setNowType={handleNowType}
          />
        </TextBlockContentBox>
      );
    }
  };
  return <>{renderTypeBlock()}</>;
}



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
