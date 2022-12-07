import { API } from '@/config/config';
import { axiosGetRequest, axiosPostRequest } from '@/utils/axios.request';
import { AxiosResponse } from 'axios';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { workSpaceNameAtom, workSpaceIdAtom } from '@/store/workSpaceAtom';
interface user {
  url?: string;
  nickname: string;
}

interface userDataSet {
  nickname: string;
}

interface clickedUser extends Element {
  dataset: userDataSet;
}

export default function SettingModalContent() {
  const [workSpaceName, setWorkSpaceName] = useAtom(workSpaceNameAtom);
  const [workSpaceId, setWorkSpaceId] = useAtom(workSpaceIdAtom);
  const inputNicknameRef = useRef<HTMLInputElement>(null);
  const inputSpacenameRef = useRef<HTMLInputElement>(null);
  const [searchResult, setSearchResult] = useState<user[]>([]);
  const submitSpaceName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
    const requestBody = {
      name,
      workspace: workSpaceId,
    };
    const requestHeader = {
      Authorization: localStorage.getItem('jwt'),
    };
    const onSuccess = (res: AxiosResponse) => {
      setWorkSpaceName(name);
      if (inputSpacenameRef.current === null) return;
      inputSpacenameRef.current.value = '';
      inputSpacenameRef.current.placeholder = name;
      alert('성공적으로 변경되었습니다.');
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    axiosPostRequest(API.RENAME_WORKSPACE, onSuccess, onFail, requestBody, requestHeader);
  };
  const submitInviteUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestBody = {
      nickname: (e.currentTarget.elements.namedItem('nickname') as HTMLInputElement).value,
      workspace: workSpaceId,
    };
    const requestHeader = {
      Authorization: localStorage.getItem('jwt'),
    };
    const onSuccess = (res: AxiosResponse) => {
      alert('성공적으로 초대되었습니다.');
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    axiosPostRequest(
      'http://localhost:8080/api/workspace/invite',
      onSuccess,
      onFail,
      requestBody,
      requestHeader,
    );
  };
  const onClickSearchedUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    const clickedUser = e.currentTarget as clickedUser;
    const nickname = clickedUser.dataset.nickname;
    console.log(clickedUser, nickname, inputNicknameRef.current);
    if (inputNicknameRef.current === null) return;
    inputNicknameRef.current.value = nickname;
  };
  const onSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    if (nickname === '') {
      setSearchResult([]);
      return;
    }
    const onSuccess = (res: AxiosResponse) => {
      setSearchResult(res.data.users);
    };
    const onFail = (res: AxiosResponse) => {
      console.log(res.data);
    };
    const requestHeader = {
      Authorization: localStorage.getItem('jwt'),
    };
    axiosGetRequest(
      `http://localhost:8080/api/user/search/${nickname}`,
      onSuccess,
      onFail,
      requestHeader,
    );
  };
  return (
    <SettingModalContainer>
      <h2>설정</h2>
      <h3>워크스페이스 이름 변경</h3>
      <SetSpaceNameForm onSubmit={submitSpaceName}>
        <SpaceNameInput
          ref={inputSpacenameRef}
          placeholder={workSpaceName}
          name="name"
        ></SpaceNameInput>
      </SetSpaceNameForm>
      <h3>사용자 초대</h3>
      <InviteUserForm onSubmit={submitInviteUser}>
        <UserNameInput
          ref={inputNicknameRef}
          placeholder="이름을 입력하세요"
          name="nickname"
          onChange={onSearchNameChange}
        ></UserNameInput>
      </InviteUserForm>
      <SearchResults>
        {searchResult.map((user, index) => (
          <SearchedUserWrapper
            key={index}
            onClick={onClickSearchedUser}
            data-nickname={user.nickname}
          >
            <ProfileImage
              src={`${user.url === undefined ? '/assets/icons/profileImage.png' : user.url}`}
            />
            <span>{user.nickname}</span>
          </SearchedUserWrapper>
        ))}
      </SearchResults>
    </SettingModalContainer>
  );
}
const SettingModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 12px;
`;
const SetSpaceNameForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 28px;
  width: 100%;
`;
const SpaceNameInput = styled.input`
  height: 100%;
  font-size: 14px;
`;
const InviteUserForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 28px;
  width: 100%;
`;
const UserNameInput = styled.input`
  height: 100%;
  font-size: 14px;
`;
const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  height: 100%;
`;
const SearchedUserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 12px;
  gap: 8px;
  cursor: pointer;
`;
const ProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: gray;
  border: 1px solid gray;
`;
