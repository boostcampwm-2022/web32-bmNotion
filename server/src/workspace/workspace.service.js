const { ObjectId } = require('mongodb');
const { readAllDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');
const { readOneDocument, updateOneDocument } = require('../db/db.crud');
const responseMessage = require('../response.message.json');
const createResponse = require('../utils/response.util');

const getWorkspacesPipeline = async (userId) => {
  const queryCriteria = {
    $or: [{ owner: userId }, { members: { $elemMatch: { userId: userId } } }],
  };
  const workspaceList = await readAllDocument(dbConfig.COLLECTION_WORKSPACE, queryCriteria);
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.workspaceList = workspaceList;

  return response;
};

const inviteUserPipeline = async (userid, workspaceid, nickname) => {
  console.log(userid, workspaceid, nickname);
  const workspace = await readOneDocument(dbConfig.COLLECTION_WORKSPACE, {
    _id: ObjectId(workspaceid),
  });
  if (workspace === null) {
    return createResponse(responseMessage.PAGE_NOT_FOUND);
  }
  if (workspace.owner !== userid) {
    return createResponse(responseMessage.AUTH_FAIL);
  }
  const invitee = await readOneDocument(dbConfig.COLLECTION_USER, { nickname });
  if (invitee === null) {
    return createResponse(responseMessage.USER_NOT_FOUND);
  }
  await updateOneDocument(
    dbConfig.COLLECTION_WORKSPACE,
    { _id: workspaceid },
    { $addToSet: { members: invitee.id } },
  );
  await updateOneDocument(
    dbConfig.COLLECTION_USER,
    { id: invitee.id },
    { $addToSet: { workspaces: workspaceid } },
  );
  return createResponse(responseMessage.PROCESS_SUCCESS);
};

module.exports = {
  getWorkspacesPipeline,
  inviteUserPipeline,
};
