const { readAllDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');
const responseMessage = require('../response.message.json');
const createResponse = require('../utils/response.util');
const { createObjectUrl } = require('../auth/auth.service');

const searchUserPipeline = async (nickname) => {
  const regex = new RegExp(nickname);
  const users = await readAllDocument(dbConfig.COLLECTION_USER, { nickname: { $regex: regex } });
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

module.exports = { searchUserPipeline };
