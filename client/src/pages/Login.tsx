import React, { useState, ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import bmLogo from '@/assets/icons/BM_logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { API } from '@/config/config';
import jwt from 'jsonwebtoken';
import { axiosPostRequest } from '@/utils/axios.request';
import { useAtom } from 'jotai';
import { workSpaceNameAtom, workSpaceIdAtom } from '@/store/workSpaceAtom';
import { userNickNameAtom, userIdAtom } from '@/store/userAtom';

export default function Login(): ReactElement {
  const [, setWorkSpaceName] = useAtom(workSpaceNameAtom);
  const [, setWorkSpaceId] = useAtom(workSpaceIdAtom);
  const [, setUserNickName] = useAtom(userNickNameAtom);
  const [, setUserId] = useAtom(userIdAtom);
  const [inputID, setInputID] = useState('');
  const [inputPassWord, setInputPassWord] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  let navigate = useNavigate();

  const handleInputID = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputID(value);
  };

  const handleInputPassWord = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputPassWord(value);
  };

  useEffect(() => {
    if (alertMessage) {
      setAlertMessage('');
    }
  }, [inputID, inputPassWord]);

  const onClickRegisterBtn = () => {
    const requestBody = { id: inputID, password: inputPassWord };
    const onSuccess = (res: AxiosResponse) => {
      const { nickname, id } = jwt.decode(res.data.authorize) as any;
      const { authorize, workspace, spacename } = res.data;
      localStorage.setItem('jwt', authorize);
      setWorkSpaceName(spacename);
      setWorkSpaceId(workspace);
      setUserNickName(nickname);
      setUserId(id);
      alert('로그인 되었습니다.');
      navigate(`/page/${res.data.pageid}`);
    };
    const onFail = (res: AxiosResponse) => {
      setAlertMessage(res.data.message || '아이디나 패스워드가 올바르지 않습니다.');
    };
    axiosPostRequest(API.LOGIN, onSuccess, onFail, requestBody, {});
  };

  return (
    <Wrapper>
      <Container>
        <ContainerBody>
          <Logo />
          <InputDiv
            inputValue={inputID}
            name="id"
            placeholder="아이디를 입력하세요"
            onChange={handleInputID}
            alertMessage=""
            type="text"
          />
          <InputDiv
            inputValue={inputPassWord}
            name="pw"
            placeholder="비밀번호를 입력하세요"
            onChange={handleInputPassWord}
            alertMessage={alertMessage}
            type="password"
          />

          <ButtonContainer>
            <NormalButton
              onClick={() => {
                navigate('/register');
              }}
              login={false}
            >
              회원가입
            </NormalButton>
            <NormalButton onClick={onClickRegisterBtn} login={true}>
              로그인
            </NormalButton>
          </ButtonContainer>
        </ContainerBody>
      </Container>
    </Wrapper>
  );
}

function InputDiv({
  inputValue,
  name,
  placeholder,
  onChange,
  alertMessage,
  type,
}: {
  inputValue: string;
  name: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  alertMessage: string;
  type: string;
}) {
  return (
    <>
      <InputContainer>
        <Input
          type={type}
          name={name}
          placeholder={placeholder}
          value={inputValue}
          onChange={onChange}
        />
      </InputContainer>
      <ValidationContainer>
        {alertMessage === '' ? null : <Validation>{alertMessage}</Validation>}
      </ValidationContainer>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border: 2px solid rgba(15, 15, 15, 0.1);
  border-radius: 10px;
  width: 520px;
  height: 600px;
`;

const ContainerBody = styled.div`
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 360px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid rgba(15, 15, 15, 0.1);
  border-radius: 5px;

  &::placeholder {
    padding-left: 4px;
    color: #888888;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  color: red;
  justify-content: space-between;
  margin-top: 10px;
`;

const NormalButton = styled.button<{ login: boolean }>`
  width: 80px;
  height: 30px;

  border-radius: 4px;

  background-color: ${(props) => (props.login ? '#545454' : '#ffffff')};
  color: ${(props) => (props.login ? '#ffffff' : '#545454')};

  font-weight: 350;
  font-size: 14px;
  line-height: 20px;
  transition: all 0.1s linear;

  &:hover {
    background-color: #545454;
    color: #ffffff;
  }
`;

const ValidationContainer = styled.div`
  display: flex;
  width: 100%;
  height: 14px;
  justify-content: flex-end;
`;

const Validation = styled.div`
  color: #db4455;
  font-weight: 350;
  font-size: 10px;
  line-height: 14px;
`;

const LogoDiv = styled.div`
  width: 180px;
  height: 180px;
  overflow: hidden;
`;

const LogoImg = styled.img`
  width: 100%;
`;

const LogoTitle = styled.p`
  font-size: 32px;
`;

const LogoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function Logo() {
  return (
    <LogoBox>
      <LogoDiv>
        <LogoImg src={'/assets/icons/BM_logo.png'} alt="BM Never Break Mind" />
      </LogoDiv>
    </LogoBox>
  );
}
