import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import BlockContent from '@/components/BlockContent';
import PageComponent from '@/components/PageComponent';
import Modal from '@/components/modal/Modal';
import TopBarModalContent from '@/components/modal/TopBarModalContent';
import axios, { AxiosResponse } from 'axios';
import SettingModalContent from '@/components/modal/SettingModalContent';
import DimdLayer from '@/components/modal/DimdLayer';
import jwt from 'jsonwebtoken';
import { axiosGetRequest } from '@/utils/axios.request';
import { API } from '@/config/config';
import WorkspaceList from '@/components/WorkspaceList';
import PageList from '@/components/PageList';

interface SideBarButtonProps {
  isClicked: boolean;
  sideBarButton: string;
  sideBarHoverButton: string;
}

interface SideBarProps {
  isClicked: boolean;
  sideBarHoverButton: string;
}

const threePointButton = '/assets/icons/threePoint.png';
const hamburgerButton = '/assets/icons/hamburger.png';
const doubleArrowButton = '/assets/icons/doubleArrow.png';
const reverseDoubleArrowButton = '/assets/icons/reverseDoubleArrow.png';
const tranParentButton = '/assets/icons/transparent.png';
const SettingIconSvg = '/assets/icons/gear.svg';

export default function MainPage(): ReactElement {
  const [sideBarButton, setSideBarButton] = useState('/assets/icons/hamburger.png');
  const [sideBarHoverButton, setSideBarHoverButton] = useState('/assets/icons/doubleArrow.png');
  const [sideBarButtonClicked, setSideBarButtonClicked] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);

  const [spaceSettingModalOpen, setSpaceSettingModalOpen] = useState(false);
  const [topBarModalOpen, setTopBarModalOpen] = useState(false);

  const moveNextBlock = () => {};
  const sideBarButtonClick = () => {
    setSideBarButtonClicked(!sideBarButtonClicked);
  };

  const spaceSettingButtonClicked = () => {
    setSpaceSettingModalOpen(!spaceSettingModalOpen);
  };

  const handleTopBarModal = () => {
    setTopBarModalOpen(!topBarModalOpen);
  };
  const readerModeButtonClick = () => {
    setIsReaderMode(!isReaderMode);
  };

  useEffect(() => {
    const onSuccess = (res: AxiosResponse) => {
      setProfileImageUrl(res.data.url);
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosGetRequest(
      `http://localhost:8080/api/user/profile/${localStorage.getItem('id')}`,
      onSuccess,
      onFail,
      requestHeader,
    );
  }, [setProfileImageUrl]);

  return (
    <Wrapper>
      <SideBar isClicked={sideBarButtonClicked} sideBarHoverButton={reverseDoubleArrowButton}>
        <SideBarHeaderContainer>
          <SideBarHeader>
            <WorkspaceList />
            <SideBarButton
              isClicked={!sideBarButtonClicked}
              sideBarButton={tranParentButton}
              sideBarHoverButton={reverseDoubleArrowButton}
              onClick={sideBarButtonClick}
            ></SideBarButton>
          </SideBarHeader>
        </SideBarHeaderContainer>
        <SideBarBodyContainer>
          <SideBarBody>
            <SpaceSettingButton onClick={spaceSettingButtonClicked}>
              <SettingIcon />
              <span>설정</span>
            </SpaceSettingButton>
            {spaceSettingModalOpen && (
              <>
                <DimdLayer onClick={spaceSettingButtonClicked}></DimdLayer>
                <Modal width={'600px'} height={'500px'} position={['', '', '', '']}>
                  <SettingModalContent />
                </Modal>
              </>
            )}
            <PageList />
          </SideBarBody>
        </SideBarBodyContainer>
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
          <TopBarRight>
            <UserProfileWrapper>
              <ProfileImage
                src={`${
                  profileImageUrl === undefined ? '/assets/icons/profileImage.png' : profileImageUrl
                }`}
              />
              <span>{localStorage.getItem('nickname')}</span>
            </UserProfileWrapper>
            <TopBarOptionButton onClick={handleTopBarModal}></TopBarOptionButton>
            {topBarModalOpen && (
              <>
                <DimdLayer onClick={handleTopBarModal}></DimdLayer>
                <Modal width={'230px'} height={'500px'} position={['', '12px', '', '']}>
                  <TopBarModalContent
                    readerMode={readerModeButtonClick}
                    isReaderMode={isReaderMode}
                  />
                </Modal>
              </>
            )}
          </TopBarRight>
        </TopBar>
        <MainContainerBody>
          <PageContainer maxWidth={isReaderMode ? '100%' : '900px'}>
            <PageComponent />
          </PageContainer>
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
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 45px;
  top: 0;
`;

const TopBarLeft = styled.div`
  display: flex;

  padding: 12px;
`;

const TopBarRight = styled.div`
  display: flex;
  flex-direction: row;
  padding: 12px;
  position: relative;
`;

const TopBarOptionButton = styled.button`
  background-image: url('/assets/icons/threePoint.png');
  background-repeat: no-repeat;
  background-size: 16px 4.15px;
  background-position: center;
  width: 24px;
  height: 24px;
`;

const MainContainerBody = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 45px;
  padding: 0px 96px;
`;

const SideBarButton = styled.button<SideBarButtonProps>`
  display: ${(props) => (props.isClicked ? 'none' : '')};
  background-image: url(${(props) => props.sideBarButton});
  background-repeat: no-repeat;
  background-size: 16px 16px;
  background-position: center;
  width: 24px;
  height: 24px;
  margin: 12px;
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
  height: auto;

  &:hover {
    background-color: #ebebea;
  }
`;

const SideBarHeader = styled.div`
  display: flex;
  height: auto;
  width: 100%;
  justify-content: space-between;
  padding: 0 12px;
`;

const SideBarBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const SideBarBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 12px;
`;

const SpaceSettingButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 24px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
`;

const PageContainer = styled.div<{ maxWidth: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: ${(props) => props.maxWidth}; //900px보다 작으면 width 100%;
  min-width: 0px;
  width: 100%;
  //버튼 클릭하면 max-width: 100%
  transition: all 0.1s linear;
`;

const PageBody = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const UserProfileWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 12px;
  gap: 8px;
`;

const ProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: gray;
  border: 1px solid gray;
`;

const SettingIcon = styled.div`
  width: 12px;
  height: 12px;
  background-image: url('/assets/icons/gear.svg');
  background-size: 12px 12px;
  margin: 8px;
`;
