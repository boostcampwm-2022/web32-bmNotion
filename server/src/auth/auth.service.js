const AWS = require('aws-sdk');
const stream = require('node:stream');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { createDocument, readOneDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');
const createResponse = require('../utils/response.util');
const responseMessage = require('../response.message.json');
const { addPagePipeline } = require('../page/page.service');

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

const saveUser = async (id, password, nickname, objectName, workspaceid) => {
  const encryptedPw = encryptPassword(password);
  const user = {
    id,
    nickname,
    encryptedPw,
    objectName,
    workspaces: [workspaceid],
    likes: [],
  };
  await createDocument('user', user);
  return user;
};

const createDefaultWorkspace = async (id) => {
  const { pageid } = await addPagePipeline(id);
  const workspace = {
    title: `${id}'s Notion`,
    owner: id,
    members: [id],
    pages: [pageid],
    treshcan: [],
  };
  const result = await createDocument(dbConfig.COLLECTION_WORKSPACE, workspace);
  return result.insertedId;
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

const overlapUserInfo = (existId, existNickname) => {
  if (!existId) {
    return createResponse(responseMessage.EXIST_NICKNAME);
  }
  if (!existNickname) {
    return createResponse(responseMessage.EXIST_NICKNAME);
  }
  return createResponse(responseMessage.EXIST_BOTH);
};

const signUpPipeline = async (id, password, nickname, file) => {
  const user = await searchUser(id, nickname);
  if (user !== null) return overlapUserInfo(user.id === id, user.nickname === nickname);
  const objectName = file ? `${id}.profile` : undefined;
  await uploadImg(objectName, file);
  const workspace = await createDefaultWorkspace(id);
  await saveUser(id, password, nickname, objectName, workspace);
  return createResponse(responseMessage.PROCESS_SUCCESS);
};

const selectCurrnetPage = (pages) =>
  pages.reduce((pre, cur) => {
    const { _id: pageid, lasteditedtime } = cur;
    const curTime = Date.parse(lasteditedtime);
    if (pre === undefined) return { pageid, time: curTime };
    return pre.time > curTime ? pre : { pageid, time: curTime };
  }, undefined).pageid;

const getCurrentPageInWorkspace = async (workspaceId) => {
  const workspace = await readOneDocument(dbConfig.COLLECTION_WORKSPACE, {
    _id: ObjectId(workspaceId),
  });
  const pages = await Promise.all(
    workspace.pages.map((pageid) =>
      readOneDocument(dbConfig.COLLECTION_PAGE, { _id: ObjectId(pageid) }),
    ),
  );
  return selectCurrnetPage(pages);
};

const saveTokenDocument = async (refreshToken, id, nickname) => {
  await createDocument(dbConfig.COLLECTION_TOKEN, { refreshToken, id, nickname });
};

const signInPipeline = async (id, password) => {
  const user = await searchUserById(id);
  if (user !== null) {
    return { response: createResponse(responseMessage.SIGNIN_FAIL) };
  }
  const encrypted = encryptPassword(password);
  if (encrypted !== user.encryptedPw) {
    return { response: createResponse(responseMessage.SIGNIN_FAIL) };
  }
  const accessToken = createNewAccesstoken(user.id, user.nickname);
  const refreshToken = createNewRefreshtoken();
  await saveTokenDocument(refreshToken, user.id, user.nickname);
  const [workspace] = user.workspaces;
  const pageid = await getCurrentPageInWorkspace(workspace);
  const response = {
    ...createResponse(responseMessage.PROCESS_SUCCESS),
    authorize: accessToken,
    workspace,
    pageid,
  };
  return {
    refreshToken,
    response,
  };
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

module.exports = {
  signInPipeline,
  signUpPipeline,
  isValidAccesstoken,
  isValidRefreshtoken,
  createNewAccesstokenByRefreshtoken,
  createObjectUrl,
};
