const AWS = require('aws-sdk');
const stream = require('node:stream');
const jwt = require('jsonwebtoken');
const { createDocument } = require('../db/db.crud');

const region = 'kr-standard';
const bucketName = `${process.env.BUCKET_NAME}`;
const accessKey = `${process.env.ACCESS_KEY}`;
const secretKey = `${process.env.SECRET_KEY}`;

const S3 = new AWS.S3({
  endpoint: 'https://kr.object.ncloudstorage.com',
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

const uploadImg = async (objectName, file) => {
  if (file === undefined) return;
  await S3.upload({
    Bucket: bucketName,
    Key: objectName,
    Body: stream.Readable.from(file.buffer),
  }).promise();
};

const searchUserById = (id) => {
  // todo
  // search user by id
  const user = [id];
  return user;
};

const searchUserByNickName = (nickname) => {
  // todo
  // search user by nickname
  const user = [nickname];
  return user;
};

const searchUser = (id, nickname) => {
  // todo
  // search user by id or nickname
  let user = searchUserById(id);
  user = user !== undefined ? searchUserByNickName(nickname) : user;
  return undefined;
};

const createObjectUrl = (objectName) => {
  const params = { Bucket: bucketName, Key: objectName };
  const url = S3.getSignedUrl('getObject', params);
  return url;
};

const encryptPassword = (password) => {
  // todo
  // password encrypt logic
  const encrypted = password;
  return encrypted;
};

const saveUser = async (id, password, nickname, objectName) => {
  const encryptedPw = encryptPassword(password);
  const user = {
    id,
    nickname,
    encryptedPw,
    objectName,
  };
  await createDocument('user', user);
  return user;
};

const createResponse = (message) => {
  const response = { code: '500', message: '' };
  switch (message) {
    case 'success':
      response.code = 202;
      response.message = 'Success';
      break;
    case 'exist nickname':
      response.code = 404;
      response.message = { nickname: '이미 사용중인 닉네임입니다.' };
      break;
    case 'exist id':
      response.code = 404;
      response.message = { nickname: '이미 사용중인 아이디입니다.' };
      break;
    case 'fail':
      response.code = 404;
      response.message = '아이디나 비밀번호가 올바르지 않습니다.';
      break;
    default:
      break;
  }
  return response;
};

const signUpPipeline = async (id, password, nickname, file) => {
  const user = searchUser(id, nickname);
  let message = '';
  if (user === undefined) {
    const objectName = `${id}.profile`;
    await uploadImg(objectName, file);
    await saveUser(id, password, nickname, objectName);
    message = 'success';
  } else if (user.nickname === nickname) {
    message = 'exist nickname';
  } else if (user.id === id) {
    message = 'exist id';
  }
  return createResponse(message);
};

const signInPipeline = (id, password) => {
  const user = searchUserById(id);
  const encrypted = encryptPassword(password);
  if (encrypted === user.password) {
    const accessToken = jwt.sign(
      {
        nickname: user.nickname,
        id: user.id,
      },
      process.env.ACCESS_SECRET_KEY,
      {
        expiresIn: '1h',
      },
    );
    const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET_KEY, {
      expiresIn: '24h',
    });
    return { accessToken, refreshToken, response: createResponse('sucess') };
  }
  return { response: createResponse('fail') };
};
module.exports = { signInPipeline, signUpPipeline };
