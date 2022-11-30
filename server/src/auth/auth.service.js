const { createDocument, readOneDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');
const createResponse = require('../utils/response.util');
const responseMessage = require('../response.message.json');
const { uploadImg } = require('../utils/objectStorage.util');
const { isExistId, isExistNickname, userCrud } = require('../user/user.service');
const { encryptPassword } = require('../utils/encrypt.util');
const { workspaceCrud } = require('../workspace/workspace.service');
const { createNewAccesstoken, createNewRefreshtoken } = require('../utils/jwt.util');
const { pageCrud, selectLastEditedPage } = require('../page/page.service');

const createOverlapResponse = (existId, existNickname) => {
  if (!existId) {
    return createResponse(responseMessage.EXIST_NICKNAME);
  }
  if (!existNickname) {
    return createResponse(responseMessage.EXIST_NICKNAME);
  }
  return createResponse(responseMessage.EXIST_BOTH);
};

const signUpPipeline = async (id, password, nickname, file) => {
  const existId = await isExistId(id);
  const existNickname = await isExistNickname(nickname);
  if (existId || existNickname) return createOverlapResponse(existId, existNickname);
  const objectName = file ? `${id}.profile` : undefined;
  await uploadImg(objectName, file);
  const workspace = await workspaceCrud.createDefaultWorkspace(id);
  await userCrud.createUser(id, password, nickname, objectName, workspace);
  return createResponse(responseMessage.PROCESS_SUCCESS);
};

const getLastEditedPageId = async (workspaceId) => {
  const workspace = await workspaceCrud.readWorkSpaceById(workspaceId);
  const pages = await pageCrud.readPages(workspace.pages);
  return selectLastEditedPage(pages).pageid;
};

const saveTokenDocument = async (refreshToken, id, nickname) => {
  await createDocument(dbConfig.COLLECTION_TOKEN, { refreshToken, id, nickname });
};

const createSignInResponse = (accessToken, refreshToken, workspace, pageid, title) => {
  const response = {
    ...createResponse(responseMessage.PROCESS_SUCCESS),
    authorize: accessToken,
    workspace,
    pageid,
    spacename: title,
  };
  return { refreshToken, response };
};

const signInPipeline = async (id, password) => {
  const user = await userCrud.readUserById(id);
  if (user === null) return { response: createResponse(responseMessage.SIGNIN_FAIL) };
  const encrypted = encryptPassword(password);
  if (encrypted !== user.password) return { response: createResponse(responseMessage.SIGNIN_FAIL) };
  const accessToken = createNewAccesstoken(user.id, user.nickname);
  const refreshToken = createNewRefreshtoken();
  await saveTokenDocument(refreshToken, user.id, user.nickname);
  const [workspace] = user.workspaces;
  const { title } = await workspaceCrud.readWorkSpaceById(workspace);
  const pageid = await getLastEditedPageId(workspace);
  return createSignInResponse(accessToken, refreshToken, workspace, pageid, title);
};

const createNewAccesstokenByRefreshtoken = async (refreshToken) => {
  const { id, nickname } = await readOneDocument(dbConfig.COLLECTION_TOKEN, { refreshToken });
  const accessToken = createNewAccesstoken(id, nickname);
  return accessToken;
};

module.exports = {
  signInPipeline,
  signUpPipeline,
  createNewAccesstokenByRefreshtoken,
};
