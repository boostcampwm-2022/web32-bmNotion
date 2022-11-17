import React, { useState, ReactElement, useEffect } from 'react';
import styled from "styled-components";
import CameraIcon from "@/assets/icons/camera.png"
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function Login():ReactElement {
  const [inputID, setInputID] = useState("");
  const [inputPassWord, setInputPassWord] = useState("");
  
  let navigate = useNavigate();

  const handleInputID = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget:{value},
    } = event;
    setInputID(value);
  }

  const handleInputPassWord = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget:{value},
    } = event;
    setInputPassWord(value);
  }

  const onClickRegisterBtn = () => {
    console.log(inputID);
    console.log(inputPassWord);
  };

  return (
    <Wrapper>
      <Container>
        <HeaderContainer>
          <HeaderText>
            로그인
          </HeaderText>
        </HeaderContainer>
        <ContainerBody>
          <div>
            <img src="" alt="BM Nver Break Mind"/>
            <p>BM NOTION</p>
          </div>
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
            alertMessage=""
            type="password"
          />
          
          <ButtonContainer>
            <NormalButton onClick={() => {navigate("/register")}} login={false}>
              회원가입
            </NormalButton>
            <NormalButton onClick={onClickRegisterBtn} login={true}>로그인</NormalButton>
          </ButtonContainer>
          
        </ContainerBody>
      </Container>
    </Wrapper>
  );
}

function InputDiv(
  {inputValue, name, placeholder, onChange, alertMessage, type}:
  {
    inputValue: string,
    name: string,
    placeholder: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    alertMessage: string,
    type: string,
}
  ) {
  return (
    <>
      <InputContainer>
        <Input
          type={type}
          name={name}
          placeholder={placeholder}
          value={inputValue}
          onChange={onChange}/>
      </InputContainer>
      <ValidationContainer>
          {alertMessage? (null) : (<Validation>{alertMessage}</Validation>)}
      </ValidationContainer>
    </>
  ) 
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
  color: red;
  justify-content: space-between;
  margin-top: 10px;
`

const NormalButton = styled.button<{login: boolean}>`
  width: 80px;
  height: 30px;

  border-radius: 4px;
  
  background-color: ${props => props.login ? "#545454" : "#ffffff"};
  color: ${props => props.login ? "#ffffff" : "#545454"};

  font-weight: 350;
  font-size: 14px;
  line-height: 20px;
  transition: all 0.1s linear;

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
