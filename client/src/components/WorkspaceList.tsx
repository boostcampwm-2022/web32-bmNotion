import { API } from '@/config/config';
import { axiosGetRequest, axiosPostRequest } from '@/utils/axios.request';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { workSpaceNameAtom, workSpaceIdAtom } from '@/store/workSpaceAtom';
import { userIdAtom } from '@/store/userAtom';
interface Workspace {
  title: string;
  id: string;
}

interface WorkspaceContentsProps {
  listButtonCilcked: boolean;
}

interface WorkspaceProps {
  listButtonCilcked: boolean;
}

export default function WorkspaceList({ listButtonCilcked }: WorkspaceProps) {
  const [workSpaceName, setWorkSpaceName] = useAtom(workSpaceNameAtom);
  const [workSpaceId, setWorkSpaceId] = useAtom(workSpaceIdAtom);
  const [userId] = useAtom(userIdAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceList, setWorkspaceList] = useState<Workspace[]>([]);
  const { pageid } = useParams();

  const navigate = useNavigate();

  const requestSpaceList = () => {
    const onSuccess = (res: AxiosResponse) => {
      setWorkspaceList(res.data.workspaceList);
      setIsLoading(true);
    };
    const onFail = (res: AxiosResponse) => {};
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosGetRequest(API.GET_WORKSPACE_LIST, onSuccess, onFail, requestHeader);
  };

  const requestAddSpace = () => {
    const onSuccess = (res: AxiosResponse) => {
      const { workspaceid } = res.data;
      if (workspaceid === undefined) return;
      setWorkspaceList((prev) => {
        return [...prev, { id: workspaceid, title: `${userId}'s Notion` }];
      });
    };
    const onFail = (res: AxiosResponse) => {};
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosPostRequest(API.ADD_WORKSPACE, onSuccess, onFail, {}, requestHeader);
  };

  useEffect(() => {
    requestSpaceList();
  }, [pageid]);

  const onClickWorkspace = (workspaceId: string) => {
    if (isLoading === false) return;
    const onSuccess = (res: AxiosResponse) => {
      const { spacename, pageid } = res.data;
      setWorkSpaceId(workspaceId);
      setWorkSpaceName(spacename);
      navigate(`/page/${pageid}`);
    };
    const onFail = (res: AxiosResponse) => {};
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosGetRequest(API.GET_WORKSPACE + workspaceId, onSuccess, onFail, requestHeader);
  };

  if (isLoading === false) return <></>;
  return (
    <WorkspaceListWrapper listButtonCilcked={listButtonCilcked}>
      <WorkspaceContents>
        {workspaceList
          .filter((workspace) => workspace.id !== workSpaceId)
          .map((workspace) => (
            <WorkspaceContentWrapper
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onClickWorkspace(workspace.id);
              }}
              key={workspace.id + workspace.title}
            >
              <WorkspaceContentSpan>{workspace.title}</WorkspaceContentSpan>
            </WorkspaceContentWrapper>
          ))}
      </WorkspaceContents>
      <AddWorkspaceButton listButtonCilcked={listButtonCilcked}>
        <AddWorkspaceSpan onClick={requestAddSpace}>+</AddWorkspaceSpan>
      </AddWorkspaceButton>
    </WorkspaceListWrapper>
  );
}

const WorkspaceListWrapper = styled.div<WorkspaceContentsProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${(props) => (props.listButtonCilcked ? '200px' : '0px')};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: white;
  border: 1.2px rgba(225, 225, 225, 0.6) solid;
  border-top: none;
  margin-bottom: 10px;
  transition: all 0.2s linear;
  justify-content: space-between;
`;

const WorkspaceContents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 150px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

const WorkspaceContentWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 0px 4px 8px;
  width: 100%;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: rgba(55, 53, 47, 0.08);
  }
`;

const WorkspaceContentSpan = styled.span`
  height: 24px;
  font-size: 14px;
`;

const AddWorkspaceButton = styled.button<WorkspaceContentsProps>`
  display: ${(props) => (props.listButtonCilcked ? 'block' : 'none')};
  bottom: 0;
  width: 100%;
  height: 26px;
  background-color: rgba(225, 225, 225, 0.3);
  border-top: 1.2px rgba(225, 225, 225, 0.6) solid;

  &:hover {
    background-color: rgba(55, 53, 47, 0.1);
  }
`;

const AddWorkspaceSpan = styled.span`
  color: rgba(55, 53, 47, 0.4);
  font-size: 20px;
  width: 100%;
`;
