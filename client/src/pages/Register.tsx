import React, { useState, ReactElement, useEffect } from 'react';
import styled from "styled-components";
import CameraIcon from "@/assets/icons/camera.png"

export default function Register():ReactElement {
  const [inputNickName, setInputNickName] = useState("");
  const [inputID, setInputID] = useState("");
  const [inputPassWord, setInputPassWord] = useState("");
  const [inputCheckPassWord, setInputCheckPassWord] = useState("");

  const [nickNameValidation, setNickNameValidation] = useState(true);
  const [iDValidation, setIDValidation] = useState(true);
  const [passWordValidation, setPassWordValidation] = useState(false);

  const [registerValidation, setRegisterValidation] = useState(false);

  const handleInputNickName = (event:React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget:{value},
    } = event;
    setInputNickName(value);
  }

  const handleInputID = (event:React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget:{value},
    } = event;
    setInputID(value);
  }

  const handleInputPassWord = (event:React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget:{value},
    } = event;
    setInputPassWord(value);
  }

  const handleInputCheckPassWord = (event:React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget:{value},
    } = event;
    setInputCheckPassWord(value);
  }

  const onClickRegisterBtn = () => {
    if(registerValidation) {
      console.log(inputNickName);
      console.log(inputID);
      console.log(inputPassWord);
    }
  };

  useEffect(()=>{
    if(inputCheckPassWord && inputPassWord !== inputCheckPassWord) {
      setPassWordValidation(false);
    }
    else {
      setPassWordValidation(true);
    }
  },[inputPassWord, inputCheckPassWord])

  useEffect(()=>{
    if(nickNameValidation&&iDValidation&&passWordValidation) {
      setRegisterValidation(true);
    }
    else {
      setRegisterValidation(false);
    }
  },[nickNameValidation,iDValidation,passWordValidation])

  return (
    <Wrapper>
      <Container>
        <HeaderContainer>
          <HeaderText>
            회원가입
          </HeaderText>
        </HeaderContainer>
        <ContainerBody>
          <ProfileImage>
            <ProfileUpLoadButtton>
              <img src="/assets/icons/camera.png"></img>
            </ProfileUpLoadButtton>
          </ProfileImage>
          <InputContainer>
            <InputHeader>닉네임</InputHeader>
            <Input
            placeholder="닉네임을 입력하세요"
            value={inputNickName}
            onChange={handleInputNickName}/>
          </InputContainer>
          <ValidationContainer>
          {nickNameValidation? (null) : (<Validation>이미 사용중인 닉네임입니다</Validation>)}
            
          </ValidationContainer>
          <InputContainer>
            <InputHeader>ID</InputHeader>
            <Input
            placeholder="ID를 입력하세요"
            value={inputID}
            onChange={handleInputID}/>
          </InputContainer>
          <ValidationContainer>
          {iDValidation? (null) : (<Validation>이미 사용중인 ID입니다</Validation>)}
            
          </ValidationContainer>
          <InputContainer>
            <InputHeader>Password</InputHeader>
            <InputPassWordContainer>
            <InputPassWord
            type="password"
            placeholder="비밀번호"
            value={inputPassWord}
            onChange={handleInputPassWord}/>
            <InputPassWord
            type="password"
            placeholder="비밀번호 확인"
            value={inputCheckPassWord}
            onChange={handleInputCheckPassWord}/>
            </InputPassWordContainer>
          </InputContainer>
          <ValidationContainer>
            {passWordValidation? (null) : (<Validation>비밀번호가 일치하지 않습니다</Validation>)}
          </ValidationContainer>
          <ButtonContainer>
            <RegisterButton disabled={!registerValidation} onClick={onClickRegisterBtn}>회원가입</RegisterButton>
          </ButtonContainer>
        </ContainerBody>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height: 100vh;
`

const Container = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  background: #FFFFFF;
  border: 2px solid rgba(15, 15, 15, 0.1);
  border-radius: 10px;
  width:520px;
  height:600px;
`

const HeaderContainer = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 26px;
  width:100%;
  margin:20px 0px;
  padding: 0px 20px;
`
const HeaderText = styled.div`
  
`

const ContainerBody = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  width:360px;
`

const ProfileImage = styled.div`
  width: 132px;
  height: 132px;
  border: 2px solid #666666;
  border-radius:50%;
  position:relative;
  margin-bottom: 20px;
`
const ProfileUpLoadButtton = styled.button`
  position:absolute;
  width: 30px;
  height: 30px;
  background: #ffffff;
  right:8px;
  bottom:8px;
  border-radius: 50%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom:4px;
`

const InputHeader = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 23px;
  color: #545454;
  margin-bottom: 8px;
`

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid rgba(15, 15, 15, 0.1);
  border-radius: 5px;

  &::placeholder{
    padding-left: 4px;
		color: #888888
	}
`

const InputPassWord = styled.input`
  width: 176px;
  height: 40px;
  border: 1px solid rgba(15, 15, 15, 0.1);
  border-radius: 5px;

  &::placeholder{
    padding-left: 4px;
		color: #888888
	}
`

const InputPassWordContainer = styled.div`
  display:flex;
  flex-direction: row;
  width: 360px;
  justify-content: space-between;
`

const ButtonContainer = styled.div`
  display:flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 10px;
`

const RegisterButton = styled.button`
  width: 80px;
  height: 30px;
  background-color: #545454;
  border-radius: 4px;
  color: #ffffff;
  font-weight: 350;
  font-size: 14px;
  line-height: 20px;
  transition: all 0.1s linear;

  &:disabled {
    background-color:#ffffff;
    border: 1px solid #545454;
    color:#545454;
  }

  &:hover {
    background-color: #545454;
    color: #ffffff;
  }
`

const ValidationContainer = styled.div`
  display:flex;
  width: 100%;
  height: 14px;
  justify-content: flex-end;
`

const Validation = styled.div`
  color: #DB4455;
  font-weight: 350;
  font-size: 10px;
  line-height: 14px;
`