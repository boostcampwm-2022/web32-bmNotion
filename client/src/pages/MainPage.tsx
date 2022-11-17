import React, { useState, ReactElement, useEffect } from 'react';
import styled from "styled-components";

export default function MainPage():ReactElement {
  return (
  <Wrapper>
    <TopBar>
      <TopBarLeft>
        <SideBarButton>a</SideBarButton>
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
  height: 60px;
  background-color: red;
  top:0;
`
const TopBarLeft = styled.div`
  display:flex;

  padding: 12px;

`

const TopBarRight = styled.div`
    padding: 12px;
`

const SideBarButton = styled.div`
  background-color: green;
  background-image: url("/assets/icons/camera.png");
  width:10px;
  
  &:hover {
    background-color:blue;
  }
`