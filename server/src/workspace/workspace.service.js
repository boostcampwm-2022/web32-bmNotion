const { ObjectId } = require('mongodb');
const { readAllDocument, createDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');
const { readOneDocument, updateOneDocument } = require('../db/db.crud');
const responseMessage = require('../response.message.json');
const createResponse = require('../utils/response.util');
const { addPagePipeline } = require('../page/page.service');
const { userCrud } = require('../user/user.service');

const workspaceCrud = {
  createDefaultWorkspace: async (id) => {
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
  },
  createNewWorkspace: async (id, title, owner, members) => {
    const { pageid } = await addPagePipeline(id);
    const workspace = {
      title,
      owner,
      members,
      pages: [pageid],
      treshcan: [],
    };
    const result = await createDocument(dbConfig.COLLECTION_WORKSPACE, workspace);
    return result.insertedId;
  },
  readWorkSpaceById: async (id) => {
    const workspace = await readOneDocument(dbConfig.COLLECTION_WORKSPACE, {
      _id: ObjectId(id),
    });
    return workspace;
  },
  updateWorkspaceMember: async (workspaceId, userId) => {
    await updateOneDocument(
      dbConfig.COLLECTION_WORKSPACE,
      { _id: ObjectId(workspaceId) },
      { $addToSet: { members: userId } },
    );
  },
};

const getWorkspacesPipeline = async (userId) => {
  const queryCriteria = {
    $or: [{ owner: userId }, { members: { $elemMatch: { userId } } }],
  };
  const workspaceList = await readAllDocument(dbConfig.COLLECTION_WORKSPACE, queryCriteria);
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.workspaceList = workspaceList;

  return response;
};

const inviteUserPipeline = async (userid, workspaceid, nickname) => {
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
  await workspaceCrud.updateWorkspaceMember(workspaceid, invitee.id);
  await userCrud.updateUserWorkspace(invitee.id, workspaceid);
  return createResponse(responseMessage.PROCESS_SUCCESS);
};
const renameWorkspacePipeline = async (userid, workspaceid, workspacename) => {
  const workspace = await readOneDocument(dbConfig.COLLECTION_WORKSPACE, {
    _id: ObjectId(workspaceid),
  });
  if (workspace === null) {
    return createResponse(responseMessage.PAGE_NOT_FOUND);
  }
  if (workspace.owner !== userid) {
    return createResponse(responseMessage.AUTH_FAIL);
  }
  await updateOneDocument(
    dbConfig.COLLECTION_WORKSPACE,
    { _id: ObjectId(workspaceid) },
    { $set: { title: workspacename } },
  );
  return createResponse(responseMessage.PROCESS_SUCCESS);
};

const addWorkspacePipeline = async (userId, title, members) => {
  const workspaceDocument = await workspaceCrud.createNewWorkspace(userId, title, userId, members);
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.workspaceid = workspaceDocument;

  return response;
};

module.exports = {
  renameWorkspacePipeline,
  getWorkspacesPipeline,
  inviteUserPipeline,
  addWorkspacePipeline,
  workspaceCrud,
};
