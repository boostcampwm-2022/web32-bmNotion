import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import BlockContent from '@/components/block/BlockContent';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useAtom } from 'jotai';
import { userNickNameAtom, userIdAtom } from '@/store/userAtom';
import { workSpaceIdAtom, workSpaceNameAtom } from '@/store/workSpaceAtom';
interface SideBarButtonProps {
  isClicked: boolean;
  sideBarButton: string;
  sideBarHoverButton: string;
}

interface SideBarProps {
  isClicked: boolean;
  sideBarHoverButton: string;
}

interface MovingBoxProps {
  isClicked: boolean;
}
interface MousePositionInfo {
  positionX: number | null;
  positionY: number | null;
}

const threePointButton = '/assets/icons/threePoint.png';
const hamburgerButton = '/assets/icons/hamburger.png';
const doubleArrowButton = '/assets/icons/doubleArrow.png';
const reverseDoubleArrowButton = '/assets/icons/reverseDoubleArrow.png';
const tranParentButton = '/assets/icons/transparent.png';
const SettingIconSvg = '/assets/icons/gear.svg';

export default function MainPage(): ReactElement {
  const [mouseStartPosition, setMouseStartPosition] = useState<MousePositionInfo>({
    positionX: null,
    positionY: null,
  });
  const [mousePosition, setMousePosition] = useState<MousePositionInfo>({
    positionX: null,
    positionY: null,
  });

  const [sideBarButtonClicked, setSideBarButtonClicked] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);

  const [spaceSettingModalOpen, setSpaceSettingModalOpen] = useState(false);
  const [topBarModalOpen, setTopBarModalOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string[]>([]);
  const [listButtonCilcked, setListButtonCilcked] = useState(false);

  const [workSpaceName, setWorkSpaceName] = useAtom(workSpaceNameAtom);
  const [workSpaceId, setWorkSpaceId] = useAtom(workSpaceIdAtom);
  const [userNickName, setUserNickName] = useAtom(userNickNameAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const { pageid } = useParams();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const resetMouseEvent = () => {
    setMouseStartPosition({ ...mouseStartPosition, positionX: null, positionY: null });
    setMousePosition({ ...mousePosition, positionX: null, positionY: null });
    blocks.forEach((e) => {
      e.classList.remove('selected');
    });
    setSelectedBlockId([]);
  };

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

  const onListButtonClick = () => {
    setListButtonCilcked(!listButtonCilcked);
  };

  const setWorkspace = () => {
    const accessToken = localStorage.getItem('jwt');
    const requestHeader = {
      authorization: accessToken,
    };
    const onSuccess = (res: AxiosResponse) => {
      const { spacename, workspace } = res.data;
      if (accessToken === null) {
        navigate('/');
        return;
      }
      const { nickname, id } = jwt.decode(accessToken) as any;
      setUserNickName(nickname);
      setUserId(id);
      setWorkSpaceName(spacename);
      setWorkSpaceId(workspace);
      setIsLoading(false);
    };
    const onFail = () => {};
    axiosGetRequest(API.GET_SPACE + pageid, onSuccess, onFail, requestHeader);
  };

  useEffect(() => {
    if (workSpaceName === '' || workSpaceId === '') {
      setWorkspace();
    } else {
      setIsLoading(false);
    }
  }, [workSpaceName, workSpaceId]);

  useEffect(() => {
    if (userId === '') return;
    const onSuccess = (res: AxiosResponse) => {
      setProfileImageUrl(res.data.url);
    };
    const onFail = (res: AxiosResponse) => {};
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosGetRequest(API.GET_PROFILE + userId, onSuccess, onFail, requestHeader);
  }, [setProfileImageUrl]);

  const blocks = document.querySelectorAll('div.content') as NodeListOf<HTMLElement>;
  const dragRangeStyle = 'red';
  const handleMouseUp = () => {
    setMouseStartPosition({ ...mouseStartPosition, positionX: null, positionY: null });
    setMousePosition({ ...mousePosition, positionX: null, positionY: null });
    setSelectedBlockId(
      Array.from(document.querySelectorAll('div.selected')).map(
        (e) => e.getAttribute('data-blockid') as string,
      ),
    );
  };
  if (isLoading === true) return <div>로딩중</div>;
  return (
    <Wrapper
      onMouseUp={(e) => {
        handleMouseUp();
      }}
      onMouseMove={(e) => {
        if (mouseStartPosition.positionX && mouseStartPosition.positionY) {
          setMousePosition({ ...mousePosition, positionX: e.pageX, positionY: e.pageY });
          if (
            mouseStartPosition.positionX &&
            mouseStartPosition.positionY &&
            mousePosition.positionX &&
            mousePosition.positionY
          ) {
            const left = Math.min(mouseStartPosition.positionX, mousePosition.positionX);
            const top = Math.min(mouseStartPosition.positionY, mousePosition.positionY);
            const width = Math.max(
              mouseStartPosition.positionX - mousePosition.positionX,
              mousePosition.positionX - mouseStartPosition.positionX,
            );
            const height = Math.max(
              mouseStartPosition.positionY - mousePosition.positionY,
              mousePosition.positionY - mouseStartPosition.positionY,
            );
            const right = left + width;
            const bottom = top + height;
            blocks.forEach((e, i) => {
              if (!e.offsetTop) return;
              if (!e.offsetLeft) return;
              if (!e.offsetHeight) return;
              if (!e.offsetWidth) return;
              if (!e.offsetParent) return;
              if (!(e.offsetParent as HTMLElement).offsetTop) return;
              if (!(e.offsetParent as HTMLElement).offsetLeft) return;
              const boxTop =
                e.offsetTop +
                (e.offsetParent as HTMLElement).offsetTop +
                ((e.offsetParent as HTMLElement).offsetParent as HTMLElement).offsetTop;
              const boxBottom = boxTop + e.offsetHeight;
              const boxLeft = e.offsetLeft + (e.offsetParent as HTMLElement).offsetLeft;
              const boxRight = boxLeft + e.offsetWidth;
              if (top <= boxBottom && boxTop <= bottom && left <= boxRight && boxLeft <= right) {
                e.classList.add('selected');
              } else {
                e.classList.remove('selected');
              }
            });
          }
        }
      }}
    >
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
            <span>{userNickName}</span>
          </UserProfileWrapper>
          <TopBarOptionButton onClick={handleTopBarModal}></TopBarOptionButton>
          {topBarModalOpen && (
            <>
              <DimdLayer onClick={handleTopBarModal}></DimdLayer>
              <Modal width={'230px'} height={'500px'} position={['60px', '12px', '', '']}>
                <TopBarModalContent
                  readerMode={readerModeButtonClick}
                  isReaderMode={isReaderMode}
                />
              </Modal>
            </>
          )}
        </TopBarRight>
      </TopBar>
      <SideBar isClicked={sideBarButtonClicked} sideBarHoverButton={reverseDoubleArrowButton}>
        <SideBarHeaderContainer>
          <SideBarHeader>
            <WorkspaceHeadContent>
              <WorkSpaceTitle>{workSpaceName}</WorkSpaceTitle>
              <OpenWorkspaceButton onClick={onListButtonClick}></OpenWorkspaceButton>
            </WorkspaceHeadContent>
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
            <WorkspaceList listButtonCilcked={listButtonCilcked} />
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
      <MovingBox isClicked={sideBarButtonClicked} />
      <MainContainer>
        <MainContainerBody
          onMouseDown={(e) => {
            setMouseStartPosition({
              ...mouseStartPosition,
              positionX: e.pageX,
              positionY: e.pageY,
            });
            if (!(e.target as HTMLElement).classList.contains('content')) {
              e.preventDefault();
              const select = window.getSelection();
              select?.removeAllRanges();
            }
            blocks.forEach((e) => e.classList.remove('selected'));
          }}
        >
          <PageContainer maxWidth={isReaderMode ? '100%' : '900px'}>
            <PageComponent selectedBlockId={selectedBlockId} resetMouseEvent={resetMouseEvent} />
          </PageContainer>
        </MainContainerBody>
      </MainContainer>
      <DragRange
        style={{
          left:
            mouseStartPosition.positionX && mousePosition.positionX
              ? Math.min(mouseStartPosition.positionX, mousePosition.positionX).toString() + 'px'
              : '0px',
          top:
            mouseStartPosition.positionY && mousePosition.positionY
              ? Math.min(mouseStartPosition.positionY, mousePosition.positionY).toString() + 'px'
              : '0px',
          width:
            mouseStartPosition.positionX && mousePosition.positionX
              ? Math.max(
                  mouseStartPosition.positionX - mousePosition.positionX,
                  mousePosition.positionX - mouseStartPosition.positionX,
                ).toString() + 'px'
              : '0px',
          height:
            mouseStartPosition.positionY && mousePosition.positionY
              ? Math.max(
                  mouseStartPosition.positionY - mousePosition.positionY,
                  mousePosition.positionY - mouseStartPosition.positionY,
                ).toString() + 'px'
              : '0px',
        }}
      />
    </Wrapper>
  );
}

const DragRange = styled.div`
  background-color: rgba(35, 131, 226, 0.15);
  position: absolute;
`;

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
  background-color: white;
`;

const TopBarLeft = styled.div`
  display: flex;

  padding: 12px;
`;

const TopBarRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  padding-bottom: 45px;
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

const MovingBox = styled.div<MovingBoxProps>`
  margin-left: ${(props) => (props.isClicked ? '0px' : '-240px')};
  width: 240px;
  height: 100%;
  transition: 0.3s;
`;

const SideBar = styled.div<SideBarProps>`
  margin-left: ${(props) => (props.isClicked ? '0px' : '-240px')};
  width: 240px;
  height: 100%;
  transition: 0.3s;
  background-color: #fbfbfa;
  z-index: 10;
  position: fixed;
  top: 0;
  border-right: 1.2px rgba(225, 225, 225, 0.4) solid;

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
  z-index: 10;

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
  padding: 0px 12px;
`;

const SpaceSettingButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  width: 100%;
  height: 24px;
  padding-left: 2px;
  margin-bottom: 8px;
  border-radius: 4px;
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
  background-image: url('/assets/icons/gear.png');
  background-size: 12px 12px;
  margin: 8px;
`;

const WorkspaceHeadContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 45px;
  gap: 8px;
`;

const WorkSpaceTitle = styled.div`
  width: 120px;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 8px;
`;

const OpenWorkspaceButton = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  border-radius: 3px;
  background-image: url('/assets/icons/moreWorkSpace.png');
  background-size: 9px 11px;
  background-repeat: no-repeat;
  background-position: center;
  margin: 8px;
  opacity: 0.5;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
