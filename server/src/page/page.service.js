/* eslint no-underscore-dangle: 0 */
const { ObjectId } = require('mongodb');
const { createDocument, updateOneDocument, readOneDocument } = require('../db/db.crud');
const createResponse = require('../utils/response.util');
const responseMessage = require('../response.message.json');
const dbConfig = require('../db.config.json');

const pageCrud = {
  createPage: async (userid) => {
    const now = new Date().toUTCString();
    const page = {
      deleted: 'false',
      title: '제목없음',
      owner: userid,
      participants: [userid],
      createdtime: now,
      lasteditedtime: now,
      blocks: [],
      pages: [],
      font: 'default',
    };
    const result = await createDocument(dbConfig.COLLECTION_PAGE, page);
    return result;
  },
  readPageById: async (pageid) => {
    const page = await readOneDocument(dbConfig.COLLECTION_PAGE, { _id: ObjectId(pageid) });
    return page;
  },
  readPages: async (pageIdArray) => {
    const pages = await Promise.all(
      pageIdArray.map((pageid) =>
        readOneDocument(dbConfig.COLLECTION_PAGE, { _id: ObjectId(pageid) }),
      ),
    );
    return pages;
  },
  updatePage: async (pageid, title, blocks) => {
    await updateOneDocument(
      dbConfig.COLLECTION_PAGE,
      { _id: ObjectId(pageid) },
      { $set: { title, blocks } },
    );
  },
};

const checkPageAuthority = (page, userid) => page.participants.includes(userid);

const editPagePipeline = async (userid, title, pageid, blocks) => {
  const page = await pageCrud.readPageById(pageid);
  if (page === null) return createResponse(responseMessage.PAGE_NOT_FOUND);
  const isParticipant = checkPageAuthority(page, userid);
  if (!isParticipant) return createResponse(responseMessage.AUTH_FAIL);
  await pageCrud.updatePage(pageid, title, blocks);
  return createResponse(responseMessage.PROCESS_SUCCESS);
};

const selectLastEditedPage = (pages) =>
  pages.reduce((pre, cur) => {
    const { _id: pageid, lasteditedtime } = cur;
    const curTime = Date.parse(lasteditedtime);
    if (pre === undefined) return { pageid, time: curTime };
    return pre.time > curTime ? pre : { pageid, time: curTime };
  }, undefined);

const addPagePipeline = async (userid, workspaceid) => {
  const result = await pageCrud.createPage(userid);
  await updateOneDocument(
    dbConfig.COLLECTION_WORKSPACE,
    { _id: ObjectId(workspaceid) },
    { $addToSet: { pages: result.insertedId } },
  );
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.pageid = result.insertedId;
  return response;
};

const readPagePipeline = async (workspaceId) => {
  const workspace = await readOneDocument(dbConfig.COLLECTION_WORKSPACE, {
    _id: ObjectId(workspaceId),
  });
  const pages = await pageCrud.readPages(workspace.pages);
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.list = pages.map((page) => {
    const pageInfo = { title: page.title, id: page._id };
    return pageInfo;
  });
  return response;
};

const loadPagePipeline = async (userid, pageid) => {
  const page = await pageCrud.readPageById(pageid);
  if (page === null) return createResponse(responseMessage.PAGE_NOT_FOUND);
  const authority = page.owner === userid || page.participants.includes(userid);
  if (!authority) return createResponse(responseMessage.AUTH_FAIL);
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.title = page.title;
  response.blocks = page.blocks;
  return response;
};

module.exports = {
  addPagePipeline,
  loadPagePipeline,
  readPagePipeline,
  editPagePipeline,
  pageCrud,
  selectLastEditedPage,
};
