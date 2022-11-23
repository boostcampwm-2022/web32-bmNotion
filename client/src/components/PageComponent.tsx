import React from "react";
import styled from 'styled-components';
import BlockContent from '@/components/BlockContent';

export default function PageComponent(): React.ReactElement {
    const moveNextBlock = () => { };
    return (
        <PageBox>
            <BlockContent blockId={1} moveNextBlock={moveNextBlock}>
                123
            </BlockContent>
            <BlockContent blockId={2} moveNextBlock={moveNextBlock}>
                456
            </BlockContent>
            <BlockContent blockId={3} moveNextBlock={moveNextBlock}>
                789
            </BlockContent>
        </PageBox>
    )
}

const PageBox = styled.div`
  width: 100%;
  flex: 1;
  margin-top: 45px;
`;