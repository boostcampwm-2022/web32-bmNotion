import { API } from '@/config/config';
import { axiosGetRequest, axiosPostRequest } from '@/utils/axios.request';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { workSpaceNameAtom, workSpaceIdAtom } from '@/store/workSpaceAtom';
interface Workspace {
  title: string;
  id: string;
}

interface WorkspaceContentsProps {
  listButtonCilcked: boolean;
}

export default function WorkspaceList() {
  const [workSpaceName, setWorkSpaceName] = useAtom(workSpaceNameAtom);
  const [workSpaceId, setWorkSpaceId] = useAtom(workSpaceIdAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>([]);
  const [listButtonCilcked, setListButtonCilcked] = useState(false);
  const { pageid } = useParams();

  const navigate = useNavigate();

  const requestSpaceList = () => {
    const onSuccess = (res: AxiosResponse) => {
      setWorkspaceList(res.data.workspaceList);
      setIsLoading(true);
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosGetRequest('http://localhost:8080/api/workspace/list', onSuccess, onFail, requestHeader);
  };

  const requestAddSpace = () => {
    const onSuccess = (res: AxiosResponse) => {
      requestSpaceList();
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosPostRequest(API.ADD_WORKSPACE, onSuccess, onFail, {}, requestHeader);
  };

  // useEffect(() => {
  //   setSpacename(localStorage.getItem('spacename') as string);
  // }, [localStorage.getItem('spacename')]);

  useEffect(() => {
    requestSpaceList();
  }, [pageid]);

  const onListButtonClick = () => {
    console.log(workspaceList);
    setListButtonCilcked(!listButtonCilcked);
  };

  const onClickAddSpace = () => {
    requestAddSpace();
  };

  const onClickWorkspace = (workspaceId: string) => {
    if (isLoading === false) return;
    const onSuccess = (res: AxiosResponse) => {
      console.log(res.data);
      const { spacename, pageid } = res.data;
      setWorkSpaceId(workspaceId);
      setWorkSpaceName(spacename);
      navigate(`/page/${pageid}`);
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosGetRequest(
      `http://localhost:8080/api/workspace/info/${workspaceId}`,
      onSuccess,
      onFail,
      requestHeader,
    );
  };

  if (isLoading === false) return <></>;
  return (
    <WorkspaceListWrapper>
      <WorkspaceHeadContent>
        <span>{workSpaceName}</span>
        <OpenWorkspaceButton onClick={onListButtonClick}></OpenWorkspaceButton>
      </WorkspaceHeadContent>
      <WorkspaceContents listButtonCilcked={listButtonCilcked}>
        {workspaceList.map((workspace, index) =>
          workspace.id === workSpaceId ? (
            <></>
          ) : (
            <WorkspaceContentWrapper
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onClickWorkspace(workspace.id);
              }}
              key={index}
            >
              <WorkspaceContentSpan>{workspace.title}</WorkspaceContentSpan>
            </WorkspaceContentWrapper>
          ),
        )}
        <AddWorkspaceButton>
          <AddWorkspaceSpan onClick={onClickAddSpace}>워크스페이스 추가</AddWorkspaceSpan>
        </AddWorkspaceButton>
      </WorkspaceContents>
    </WorkspaceListWrapper>
  );
}

const WorkspaceListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const WorkspaceHeadContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 45px;
  gap: 8px;
`;

const OpenWorkspaceButton = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  border-radius: 3px;
  background-image: url('/assets/icons/arrowdown.svg');
  background-size: 16px 16px;
  background-repeat: no-repeat;
  background-position: center;
  margin: 8px;
  opacity: 0.5;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const WorkspaceContents = styled.div<WorkspaceContentsProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${(props) => (props.listButtonCilcked ? '180px' : '0px')};
  transition: all 0.2s linear;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  overflow: auto;
`;

const WorkspaceContentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  height: auto;
  cursor: pointer;
  &:hover {
    background-color: white;
    border-radius: 5px;
  }
`;

const WorkspaceContentSpan = styled.span`
  line-height: 45px;
  font-size: 14px;
`;

const AddWorkspaceButton = styled.button`
  width: 100%;
  height: auto;
  border-radius: 3px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  margin-top: 8px;
  margin-bottom: 8px;
`;

const AddWorkspaceSpan = styled.span`
  width: 100%;
  line-height: 29px;
`;
