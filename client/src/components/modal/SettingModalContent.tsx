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
    const onFail = (res: AxiosResponse) => {};
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
    const onFail = (res: AxiosResponse) => {};
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
    const onFail = (res: AxiosResponse) => {};
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
      <SettingModalTitle>
        <SettingIcon />
        설정
      </SettingModalTitle>
      <h3>워크스페이스 이름 변경</h3>
      <SetSpaceNameForm onSubmit={submitSpaceName}>
        <SpaceNameInput
          ref={inputSpacenameRef}
          placeholder={workSpaceName}
          name="name"
        ></SpaceNameInput>
        <SubmitButton>확인</SubmitButton>
      </SetSpaceNameForm>
      <h3>사용자 초대</h3>
      <InviteUserForm onSubmit={submitInviteUser}>
        <UserNameInput
          ref={inputNicknameRef}
          placeholder="이름을 입력하세요"
          name="nickname"
          onChange={onSearchNameChange}
        ></UserNameInput>
        <SubmitButton>확인</SubmitButton>
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
  padding: 20px;
`;

const SettingModalTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const SetSpaceNameForm = styled.form`
  display: flex;
  height: 28px;
  width: 100%;
  margin-bottom: 10px;
`;
const SpaceNameInput = styled.input`
  width: 300px;
  height: 100%;
  font-size: 14px;
  border: none;
  border-bottom: 1.2px rgba(225, 225, 225, 0.6) solid;

  &:focus {
    outline: none;
  }
`;

const InviteUserForm = styled.form`
  display: flex;
  align-items: center;
  height: 28px;
  width: 100%;
  margin-bottom: 10px;
`;
const UserNameInput = styled.input`
  height: 100%;
  width: 300px;
  font-size: 14px;
  border: none;
  border-bottom: 1.2px rgba(225, 225, 225, 0.6) solid;

  &:focus {
    outline: none;
  }
`;
const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 2px;
  height: 240px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;
const SearchedUserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 540px;
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
const SettingIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: url('/assets/icons/gear.svg');
  background-size: 20px 20px;
  background-repeat: no-repeat;
  margin-right: 8px;
`;

const SubmitButton = styled.button`
  width: 48px;
  height: 30px;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.7);
  border: 1.2px solid rgba(225, 225, 225, 1);

  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  transition: all 0.1s linear;
  margin-left: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
  }
`;
