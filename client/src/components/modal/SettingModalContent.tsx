import axios from 'axios';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

interface user {
  id: string;
  nickname: string;
}

export default function SettingModalContent() {
  const inputTextRef = useRef<HTMLInputElement>(null);
  const [searchResult, setSearchResult] = useState<user[]>([]);
  const submitInviteUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log((e.currentTarget.elements.namedItem('nickname') as HTMLInputElement).value);
    const requestBody = {
      nickname: (e.currentTarget.elements.namedItem('nickname') as HTMLInputElement).value,
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
  const onSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
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
          setSearchResult(res.data.users);
        } else {
          console.log(res.data);
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
        {searchResult.map((user) => (
          <div>{`닉네임: ${user.nickname} 아이디: ${user.id}`}</div>
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
  height: 100%;
`;
