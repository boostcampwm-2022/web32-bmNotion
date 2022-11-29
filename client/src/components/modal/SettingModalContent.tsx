import axios from 'axios';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

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
  const inputTextRef = useRef<HTMLInputElement>(null);
  const [searchResult, setSearchResult] = useState<user[]>([]);
  const submitInviteUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log((e.currentTarget.elements.namedItem('nickname') as HTMLInputElement).value);
    const requestBody = {
      nickname: (e.currentTarget.elements.namedItem('nickname') as HTMLInputElement).value,
      workspace: localStorage.getItem('workspace'),
    };
    axios
      .post('http://localhost:8080/api/workspace/invite', requestBody, {
        headers: {
          Authorization: localStorage.getItem('jwt'),
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.code === '202') {
          alert('성공적으로 초대되었습니다.');
        } else {
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onClickSearchedUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    const clickedUser = e.currentTarget as clickedUser;
    const nickname = clickedUser.dataset.nickname;
    console.log(clickedUser, nickname, inputTextRef.current);
    if (inputTextRef.current === null) return;
    inputTextRef.current.value = nickname;
  };
  const onSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    console.log(nickname);
    if (nickname === '') {
      setSearchResult([]);
      return;
    }
    axios
      .get(`http://localhost:8080/api/user/${nickname}`, {
        headers: {
          Authorization: localStorage.getItem('jwt'),
          withCredentials: true,
        },
      })
      .then((res) => {
        if (res.data.code === '202') {
          console.log(res.data.users);
          setSearchResult(res.data.users);
        } else {
          console.log(res);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <SettingModalContainer>
      <h2>설정</h2>
      <h3>사용자 초대</h3>
      <InviteUserForm onSubmit={submitInviteUser}>
        <UserNameInput
          ref={inputTextRef}
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
`;
