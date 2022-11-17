import React, { useState, ReactElement, useEffect } from 'react';
import styled from "styled-components";
interface SideBarButtonProps {
  isClicked: boolean;
  sideBarButton: string;
  sideBarHoverButton: string;
}

const hamburgerButton = "/assets/icons/hamburger.png";
const doubleArrowButton = "/assets/icons/doubleArrow.png";
const reverseDoubleArrowButton="/assets/icons/reverseDoubleArrow.png"
const tranParentButton="/assets/icons/transparent.png";

export default function MainPage():ReactElement {

  const [sideBarButton, setSideBarButton] = useState("/assets/icons/hamburger.png");
  const [sideBarHoverButton, setSideBarHoverButton] = useState("/assets/icons/doubleArrow.png");
  const [sideBarButtonClicked, setSideBarButtonClicked] = useState(false);

  const sideBarButtonClick = () => {
    setSideBarButtonClicked(!sideBarButtonClicked);
  }
  return (
  <Wrapper>
    <TopBar>
      <TopBarLeft>
        <SideBarButton isClicked={sideBarButtonClicked} sideBarButton={sideBarButton} sideBarHoverButton={"asd"} onClick={sideBarButtonClick}></SideBarButton>
      </TopBarLeft>
      <TopBarRight>오</TopBarRight>
    </TopBar>
    메인페이지입니다.
  </Wrapper>);
}

const Wrapper = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height: 100vh;
  position: relative;
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 45px;
  top:0;
`
const TopBarLeft = styled.div`
  display:flex;

  padding: 12px;

`

const TopBarRight = styled.div`
    padding: 12px;
`

const SideBarButton = styled.button<SideBarButtonProps>`
  background-image: url(${(props) => props.isClicked?tranParentButton:hamburgerButton});
  background-repeat: no-repeat;
  background-size:cover;
  width:16px;
  height:16px;

  transition: all 0.2s linear;
  
  &:hover {
    background-image: url(${(props) => props.isClicked?reverseDoubleArrowButton:doubleArrowButton});
  }
`