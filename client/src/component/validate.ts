export interface Params {
  [propName: string]: string;
}

export interface ErrorMessage {
  [propName: string]: string;
}

function idValidation(id: string) {
  return /^[a-zA-Z0-9]{3,10}$/.test(id)
}

function nicknameValidation(id: string) {
  return /^[a-zA-Z0-9]{3,10}$/.test(id)
}

function passwordValidation(pw1: string) {
  return /^[a-zA-Z0-9]{8,20}$/.test(pw1)
}

export function registerValidate({ id, nickname, pw1, pw2 }: Params) {
  const errors: ErrorMessage = {};

  if (!idValidation(id)) {
    errors.login = "아이디 혹은 비밀번호를 확인해 주세요";
  }
  if (!nicknameValidation(nickname)) {
    errors.nickname = "닉네임은 소문자, 대문자, 숫자로 이루어진 3 ~ 10자이여야 합니다";
  }
  if (!passwordValidation(pw1)) {
    errors.password1 = "비밀번호는 소문자, 대문자, 숫자로 이루어진 8 ~ 20자이여야 합니다"
  }
  if (pw1 !== pw2) {
    errors.password2 = "두 비밀번호가 일치하지 않습니다"
  }
  return errors;
}

export function loginValidate({ id, pw }: Params) {
  const errors: ErrorMessage = {};

  if (!idValidation(id) || !passwordValidation(pw)) {
    errors.login = "아이디 혹은 비밀번호를 확인해 주세요";
  }

  return errors;
}