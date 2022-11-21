import React, { useState, useRef, ReactElement, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register(): ReactElement {
  const [inputNickName, setInputNickName] = useState('');
  const [inputId, setInputId] = useState('');
  const [inputPassWord, setInputPassWord] = useState('');
  const [inputCheckPassWord, setInputCheckPassWord] = useState('');

  const [nickNameValidation, setNickNameValidation] = useState(true);
  const [iDValidation, setIdValidation] = useState(true);
  const [passWordValidation, setPassWordValidation] = useState(false);
  
  const [registerValidation, setRegisterValidation] = useState(false);

  const basicImage = '/assets/icons/profileImage.png';
  const [profileImage, setProfileImage] = useState(basicImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInput = React.useRef<HTMLInputElement>(null);
  let navigate = useNavigate();

  const handleInputNickName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputNickName(value);
  };

  const handleInputId = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputId(value);
  };

  const handleInputPassWord = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputPassWord(value);
  };

  const handleInputCheckPassWord = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setInputCheckPassWord(value);
  };

  const onClickRegisterBtn = () => {
    const formData = new FormData();
    if (registerValidation) {
      formData.append('id', inputId);
      formData.append('password', inputPassWord);
      formData.append('nickname', inputNickName);
      if (selectedFile) {
        formData.append('profileimage', selectedFile);
      }
      console.log(selectedFile);
      console.log(formData.get('id'));
      console.log(formData.get('password'));
      console.log(formData.get('nickname'));
      console.log(formData.get('profileimage'));
      axios
        .post('http://localhost:8080/auth/signup', formData)
        .then((res) => {
          console.log(res);
          alert('회원가입이 완료되었습니다.');
          navigate('/');
        })
        .catch(error => {
          if (error.response?.message) {
            if (error.response.message.id) {
              setIdValidateMessage(error.response.message.id)
              setIdValidation(false)
            }
            if (error.response.message.nickname) {
              setNickNameValidateMessage(error.response.message.nickname)
              setNickNameValidation(false)
            }
          }
        });
    }
  };

  useEffect(() => {
    if (nickNameValidation && iDValidation && passWordValidation) {
      setRegisterValidation(true);
    } else {
      setRegisterValidation(false);
    }
  }, [nickNameValidation, iDValidation, passWordValidation]);

  const onClickFileInput = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleInputImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setProfileImage(reader.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      setSelectedFile(e.target.files[0] as File);
    }
  };

  const [nickNameValidateMessage, setNickNameValidateMessage] = useState('');
  const [idValidateMessage, setIdValidateMessage] = useState('');
  const [passWordValidateMessage, setpassWordValidateMessage] = useState('');

  useEffect(() => {
    setPassWordValidation(isPassWordValidate(inputPassWord, inputCheckPassWord));
  }, [inputPassWord, inputCheckPassWord, passWordValidateMessage]);

  const isPassWordValidate = (passWord: string, checkPassWord: string) => {
    if (!passWord) {
      setpassWordValidateMessage('');
      return false;
    }
    if (!/^[\w!@#$%&*]{6,20}$/.test(passWord)) {
      setpassWordValidateMessage('비밀번호는 6 ~ 20 글자여야 합니다.');
      return false;
    } else if (passWord !== checkPassWord) {
      setpassWordValidateMessage('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  useEffect(() => {
    setNickNameValidation(isNickNameValidate(inputNickName));
  }, [inputNickName]);

  const isNickNameValidate = (nickName: string) => {
    if (!nickName) {
      setNickNameValidateMessage('');
      return false;
    }
    if (!/^[\w]{3,20}$/.test(nickName)) {
      setNickNameValidateMessage("닉네임은 알파벳, 숫자 혹은 '_'로 이루어진 3 ~ 20 글자여야 합니다.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    setIdValidation(isIdValidate(inputId));
  }, [inputId]);

  const isIdValidate = (id: string) => {
    if (!id) {
      setIdValidateMessage('');
      return false;
    }
    if (!/^[\w]{3,20}$/.test(id)) {
      setIdValidateMessage("ID는 알파벳, 숫자 혹은 '_'로 이루어진 3 ~ 20이어야 합니다.");
      return false;
    }
    return true;
  };

  return (
    <Wrapper>
      <Container>
        <HeaderContainer>
          <img src="/assets/logo/bmRegisterLogo.png" width="40px" />
          <HeaderText>회원가입</HeaderText>
        </HeaderContainer>
        <ContainerBody>
          <ProfileImage profileImage={profileImage}>
            <ProfileUpLoadButtton onClick={onClickFileInput}>
              <img src="/assets/icons/camera.png"></img>
              <input
                type="file"
                style={{ display: 'none' }}
                accept="image/jpg,impge/png,image/jpeg"
                name="profile_img"
                ref={fileInput}
                onChange={handleInputImage}
              />
            </ProfileUpLoadButtton>
          </ProfileImage>
          <InputContainer>
            <InputHeader>닉네임</InputHeader>
            <Input name="asd" placeholder="닉네임을 입력하세요" value={inputNickName} onChange={handleInputNickName} />
          </InputContainer>
          <ValidationContainer>
            {nickNameValidation ? null : <Validation>{nickNameValidateMessage}</Validation>}
          </ValidationContainer>
          <InputContainer>
            <InputHeader>ID</InputHeader>
            <Input placeholder="ID를 입력하세요" value={inputId} onChange={handleInputId} />
          </InputContainer>
          <ValidationContainer>
            {iDValidation ? null : <Validation>{idValidateMessage}</Validation>}
          </ValidationContainer>
          <InputContainer>
            <InputHeader>Password</InputHeader>
            <InputPassWordContainer>
              <InputPassWord
                type="password"
                placeholder="비밀번호"
                value={inputPassWord}
                onChange={handleInputPassWord}
              />
              <InputPassWord
                type="password"
                placeholder="비밀번호 확인"
                value={inputCheckPassWord}
                onChange={handleInputCheckPassWord}
              />
            </InputPassWordContainer>
          </InputContainer>
          <ValidationContainer>
            {passWordValidation ? null : <Validation>{passWordValidateMessage}</Validation>}
          </ValidationContainer>
          <ButtonContainer>
            <RegisterButton disabled={!registerValidation} onClick={onClickRegisterBtn}>
              회원가입
            </RegisterButton>
          </ButtonContainer>
        </ContainerBody>
      </Container>
    </Wrapper>
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

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 18px;
  line-height: 26px;
  width: 100%;
  margin: 20px 0px;
  padding: 0px 20px;
`;
const HeaderText = styled.div`
  color: #666666;
  margin-left: 6px;
`;

const ContainerBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 360px;
`;

const ProfileImage = styled.div<{ profileImage: string }>`
  width: 132px;
  height: 132px;
  border: 2px solid #666666;
  border-radius: 50%;
  position: relative;
  margin-bottom: 20px;
  background-color: #666666;
  background-image: url(${(props) => props.profileImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;
const ProfileUpLoadButtton = styled.button`
  position: absolute;
  width: 30px;
  height: 30px;
  background: #ffffff;
  right: 8px;
  bottom: 8px;
  border-radius: 50%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 4px;
`;

const InputHeader = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 23px;
  color: #545454;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid rgba(15, 15, 15, 0.1);
  border-radius: 5px;
  padding-left: 4px;

  &::placeholder {
    color: #888888;
  }
`;

const InputPassWord = styled.input`
  width: 176px;
  height: 40px;
  border: 1px solid rgba(15, 15, 15, 0.1);
  border-radius: 5px;
  padding-left: 4px;

  &::placeholder {
    color: #888888;
  }
`;

const InputPassWordContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 360px;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 10px;
`;

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
    background-color: #ffffff;
    border: 1px solid #545454;
    color: #545454;
  }

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
