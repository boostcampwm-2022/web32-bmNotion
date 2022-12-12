import { API } from '@/config/config';
import { axiosDeleteRequest, axiosGetRequest, axiosPostRequest } from '@/utils/axios.request';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { workSpaceIdAtom } from '@/store/workSpaceAtom';
interface Page {
  title: string;
  id: string;
  deleted: any;
}

export default function PageList() {
  const [workSpaceId] = useAtom(workSpaceIdAtom);

  const [isLoading, setIsLoading] = useState(false);
  const [pageList, setPageList] = useState<Page[]>([]);
  const { pageid } = useParams();
  const navigate = useNavigate();

  const requestPageList = () => {
    const workspaceId = workSpaceId;
    const onSuccess = (res: AxiosResponse) => {
      setPageList(res.data.list);
      setIsLoading(true);
    };
    const onFail = (res: AxiosResponse) => {};
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosGetRequest(API.GET_PAGE_LIST + workspaceId, onSuccess, onFail, requestHeader);
  };

  useEffect(() => {
    if (isLoading === false) return;
    const handleStore = (e: KeyboardEvent) => {
      if (e.code === 'KeyS') {
        const isMac = /Mac/.test(window.clientInformation.platform);
        const commandKeyPressed = isMac ? e.metaKey === true : e.ctrlKey === true;
        if (commandKeyPressed === true) {
          e.preventDefault();
          requestPageList();
        }
      }
    };
    window.addEventListener('keydown', handleStore);
    return () => {
      window.removeEventListener('keydown', handleStore);
    };
  }, [pageList]);

  useEffect(() => {
    requestPageList();
  }, [setPageList, pageid]);

  const onClickAddPage = (e: React.MouseEvent) => {
    const workspaceId = workSpaceId;
    const onSuccess = (res: AxiosResponse) => {
      const pageid = res.data.pageid;
      requestPageList();
      navigate(`/page/${pageid}`);
    };
    const onFail = (res: AxiosResponse) => {};
    const requestBody = {
      workspace: workspaceId,
    };
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosPostRequest(API.ADD_PAGE, onSuccess, onFail, requestBody, requestHeader);
  };

  const onClickPageContent = (pageid: string) => {
    navigate(`/page/${pageid}`);
  };

  const onClickDeleteButton = (pageid: string) => {
    const workspaceId = workSpaceId;
    const onSuccess = (res: AxiosResponse) => {
      requestPageList();
    };
    const onFail = (res: AxiosResponse) => {};
    const requestHeader = {
      authorization: localStorage.getItem('jwt'),
    };
    axiosDeleteRequest(
      API.DELETE_PAGE + workspaceId + '/' + pageid,
      onSuccess,
      onFail,
      requestHeader,
    );
  };

  if (isLoading === false) return <></>;
  return (
    <PageListWrapper>
      <PageListHeader>
        <PageListHeaderSpan>공유 페이지</PageListHeaderSpan>
        <PageListHeaderButton onClick={onClickAddPage}>+</PageListHeaderButton>
      </PageListHeader>
      {pageList.map((page, index) =>
        page.deleted === true ? (
          <></>
        ) : (
          <PageListContentWrapper
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onClickPageContent(page.id);
            }}
            key={index}
          >
            <PageListContentSpan>
              {page.title === '' ? '제목 없음' : page.title}
            </PageListContentSpan>
            <PageListContentDeleteButton
              onClick={(e: React.MouseEvent) => {
                onClickDeleteButton(page.id);
              }}
            >
              <DeleteIcon></DeleteIcon>
            </PageListContentDeleteButton>
          </PageListContentWrapper>
        ),
      )}
    </PageListWrapper>
  );
}

const PageListWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const PageListHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  padding: 8px;
  align-items: center;
  justify-content: space-between;
  border-top: 1.2px rgba(225, 225, 225, 0.4) solid;
`;

const PageListHeaderSpan = styled.b`
  width: auto;
  font-size: 14px;
`;

const PageListHeaderButton = styled.button`
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 14px;
  border-radius: 2px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const PageListContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    button {
      div {
        display: flex;
      }
    }
  }
`;

const PageListContentSpan = styled.span`
  font-size: 13px;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const PageListContentDeleteButton = styled.button`
  display: flex;
  width: 14px;
  height: 14px;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const DeleteIcon = styled.div`
  display: none;
  width: 8px;
  height: 8px;
  background-image: url('/assets/icons/x-solid.svg');
  background-size: 8px 8px;
`;
