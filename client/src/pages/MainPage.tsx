import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import BlockContent from '@/components/BlockContent';

interface SideBarButtonProps {
  isClicked: boolean;
  sideBarButton: string;
  sideBarHoverButton: string;
}

interface SideBarProps {
  isClicked: boolean;
  sideBarHoverButton: string;
}

const hamburgerButton = '/assets/icons/hamburger.png';
const doubleArrowButton = '/assets/icons/doubleArrow.png';
const reverseDoubleArrowButton = '/assets/icons/reverseDoubleArrow.png';
const tranParentButton = '/assets/icons/transparent.png';

export default function MainPage(): ReactElement {
  const [sideBarButton, setSideBarButton] = useState('/assets/icons/hamburger.png');
  const [sideBarHoverButton, setSideBarHoverButton] = useState('/assets/icons/doubleArrow.png');
  const [sideBarButtonClicked, setSideBarButtonClicked] = useState(false);
  const moveNextBlock = () => {};
  const sideBarButtonClick = () => {
    setSideBarButtonClicked(!sideBarButtonClicked);
  };
  return (
    <Wrapper>
      <SideBar isClicked={sideBarButtonClicked} sideBarHoverButton={reverseDoubleArrowButton}>
        <SideBarHeaderContainer>
          <SideBarHeader>
            <SideBarButton
              isClicked={!sideBarButtonClicked}
              sideBarButton={tranParentButton}
              sideBarHoverButton={reverseDoubleArrowButton}
              onClick={sideBarButtonClick}
            ></SideBarButton>
          </SideBarHeader>
        </SideBarHeaderContainer>
      </SideBar>
      <MainContainer>
        <TopBar>
          <TopBarLeft>
            <SideBarButton
              isClicked={sideBarButtonClicked}
              sideBarButton={hamburgerButton}
              sideBarHoverButton={doubleArrowButton}
              onClick={sideBarButtonClick}
            ></SideBarButton>
          </TopBarLeft>
          <TopBarRight>오</TopBarRight>
        </TopBar>
        <MainContainerBody>
          <BlockContent blockId={1} moveNextBlock={moveNextBlock}>
            123
          </BlockContent>
          <BlockContent blockId={2} moveNextBlock={moveNextBlock}>
            456
          </BlockContent>
          <BlockContent blockId={3} moveNextBlock={moveNextBlock}>
            789
          </BlockContent>
        </MainContainerBody>
      </MainContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 45px;
  top: 0;
`;

const TopBarLeft = styled.div`
  display: flex;

  padding: 12px;
`;

const TopBarRight = styled.div`
  padding: 12px;
`;

const MainContainerBody = styled.div`
  width: 100%;
  flex: 1;
  margin-top: 45px;
`;

const SideBarButton = styled.button<SideBarButtonProps>`
  display: ${(props) => (props.isClicked ? 'none' : '')};
  background-image: url(${(props) => props.sideBarButton});
  background-repeat: no-repeat;
  background-size: 16px 16px;
  background-position: center;
  width: 24px;
  height: 24px;
  transition: all 0.2s linear;
  border-radius: 3px;

  &:hover {
    background-image: url(${(props) => props.sideBarHoverButton});
    background-color: rgba(55, 53, 47, 0.08);
  }
`;

const SideBar = styled.div<SideBarProps>`
  margin-left: ${(props) => (props.isClicked ? '0px' : '-240px')};
  width: 240px;
  height: 100%;
  transition: 0.3s;
  background-color: #fbfbfa;

  &:hover {
    ${SideBarButton} {
      background-image: url(${(props) => props.sideBarHoverButton});
    }
  }
`;

const SideBarHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 45px;

  &:hover {
    background-color: #ebebea;
  }
`;

const SideBarHeader = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;
  justify-content: flex-end;
  padding: 12px;
`;

const SideBarBody = styled.div``;
