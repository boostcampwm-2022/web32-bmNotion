const AWS = require('aws-sdk');
const stream = require('node:stream');
const { createDocument } = require('../db/db.crud');

const region = 'kr-standard';
const bucketName = 'bmnotion';
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

const searchUser = (id, nickname) => {
  // todo
  // search user by id or nickname
  const user = [id, nickname];
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
  // todo
  // insert User info
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
    default:
      break;
  }
  return response;
};

const signUpPipeline = async (id, password, nickname, file) => {
  const user = searchUser(id, nickname);
  let message = '';
  if (!user) {
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

module.exports = {
  signUpPipeline,
};
