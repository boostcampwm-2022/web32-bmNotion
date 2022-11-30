const { ObjectId } = require('mongodb');
const {
  readAllDocument,
  readOneDocument,
  createDocument,
  updateOneDocument,
} = require('../db/db.crud');
const dbConfig = require('../db.config.json');
const responseMessage = require('../response.message.json');
const createResponse = require('../utils/response.util');
const { createObjectUrl } = require('../utils/objectStorage.util');
const { encryptPassword } = require('../utils/encrypt.util');

const userCrud = {
  createUser: async (id, password, nickname, objectName, workspaceid) => {
    const encryptedPw = encryptPassword(password);
    const user = {
      id,
      nickname,
      password: encryptedPw,
      objectName,
      workspaces: [workspaceid],
      likes: [],
    };
    await createDocument('user', user);
    return user;
  },
  readUserById: async (id) => {
    const user = await readOneDocument(dbConfig.COLLECTION_USER, { id });
    return user;
  },
  readUserByNickname: async (nickname) => {
    const user = await readOneDocument(dbConfig.COLLECTION_USER, { nickname });
    return user;
  },
  readUserByRegex: async (nickname) => {
    const regex = new RegExp(nickname);
    const users = await readAllDocument(dbConfig.COLLECTION_USER, { nickname: { $regex: regex } });
    return users;
  },
  updateUserWorkspace: async (userId, workspaceId) => {
    await updateOneDocument(
      dbConfig.COLLECTION_USER,
      { id: userId },
      { $addToSet: { workspaces: ObjectId(workspaceId) } },
    );
  },
};

const isExistId = async (id) => {
  const user = await userCrud.readUserById(id);
  return user !== null;
};

const isExistNickname = async (nickname) => {
  const user = await userCrud.readUserByNickname(nickname);
  return user !== null;
};

const searchUserPipeline = async (nickname) => {
  const users = userCrud.readUserByRegex(nickname);
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.users = users.map((user) => {
    const userInfo = {
      url: user.objectName === null ? undefined : createObjectUrl(user.objectName),
      nickname: user.nickname,
    };
    return userInfo;
  });
  return response;
};

module.exports = { searchUserPipeline, userCrud, isExistId, isExistNickname };
