const { readAllDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');
const responseMessage = require('../response.message.json');
const createResponse = require('../utils/response.util');

const searchUserPipeline = async (nickname) => {
  const regex = new RegExp(nickname);
  const users = await readAllDocument(dbConfig.COLLECTION_USER, { nickname: { $regex: regex } });
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.users = users.map((user) => {
    const userInfo = {
      id: user.id,
      nickname: user.nickname,
    };
    return userInfo;
  });
  return response;
};

module.exports = { searchUserPipeline };
