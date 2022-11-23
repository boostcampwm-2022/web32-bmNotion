const AWS = require('aws-sdk');
const stream = require('node:stream');
const jwt = require('jsonwebtoken');
const { createDocument, readOneDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');

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

const searchUserById = async (id) => {
  const user = await readOneDocument(dbConfig.COLLECTION_USER, { id });
  return user;
};

const searchUserByNickName = async (nickname) => {
  const user = await readOneDocument(dbConfig.COLLECTION_USER, { nickname });
  return user;
};

const searchUser = async (id, nickname) => {
  let user = await searchUserById(id);
  user = user !== null ? user : await searchUserByNickName(nickname);
  return user;
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

const createWorkspace = async (id) => {
  const workspace = {
    owner: id,
    members: [],
    pages: [],
    teshcan: []
  };

  await createDocument(dbConfig.COLLECTION_WORKSPACE, workspace);
}


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
      response.message = { id: '이미 사용중인 아이디입니다.' };
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

const createNewAccesstoken = (id, nickname) => {
  const accessToken = jwt.sign(
    {
      nickname,
      id,
    },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: '1h',
    },
  );

  return accessToken;
};

const createNewRefreshtoken = () => {
  const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET_KEY, {
    expiresIn: '24h',
  });

  return refreshToken;
};

const signUpPipeline = async (id, password, nickname, file) => {
  const user = await searchUser(id, nickname);
  let message = '';
  if (user === null) {
    const objectName = `${id}.profile`;
    await uploadImg(objectName, file);
    await saveUser(id, password, nickname, objectName);
    await createWorkspace(id);
    message = 'success';
  } else if (user.nickname === nickname) {
    message = 'exist nickname';
  } else if (user.id === id) {
    message = 'exist id';
  }
  return createResponse(message);
};

const signInPipeline = async (id, password) => {
  const user = await searchUser(id, '');
  const encrypted = encryptPassword(password);
  if (user !== null && encrypted === user.encryptedPw) {
    const accessToken = createNewAccesstoken(user.id, user.nickname);
    const refreshToken = createNewRefreshtoken();
    const newDocument = {
      refreshToken,
      id: user.id,
      nickname: user.nickname,
    };

    await createDocument(dbConfig.COLLECTION_TOKEN, newDocument);
    return { accessToken, refreshToken, response: createResponse('success') };
  }
  return { response: createResponse('fail') };
};

const isValidAccesstoken = (accessToken) => {
  try {
    jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
    return 'success';
  } catch (error) {
    return error.name;
  }
};

const isValidRefreshtoken = (refreshToken) => {
  try {
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    return 'success';
  } catch (error) {
    return error.name;
  }
};

const createNewAccesstokenByRefreshtoken = async (refreshToken) => {
  const { id, nickname } = await readOneDocument(dbConfig.COLLECTION_TOKEN, { refreshToken });

  const accessToken = createNewAccesstoken(id, nickname);

  return accessToken;
};

const createAuthResponse = (message) => {
  const response = { code: '404', message };
  switch (message) {
    case 'tokenUndefined':
      response.message = 'NeedSignInError';
      break;
    case 'tokenError':
      response.message = 'UnauthorizedUserError';
      break;
    default:
      break;
  }
};

module.exports = {
  signInPipeline,
  signUpPipeline,
  isValidAccesstoken,
  isValidRefreshtoken,
  createNewAccesstokenByRefreshtoken,
  createObjectUrl,
  createAuthResponse,
};
