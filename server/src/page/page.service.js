const { createDocument, readOneDocument } = require('../db/db.crud');
const createResponse = require('../utils/response.util');
const responseMessage = require('../response.message.json');
const dbConfig = require('../db.config.json');

const getPageById = async (pageid) => {
  const page = await readOneDocument(dbConfig.COLLECTION_PAGE, { _id: pageid });
  return page;
};

const createPage = async (userid) => {
  const now = new Date().toUTCString();
  const result = await createDocument(dbConfig.COLLECTION_PAGE, {
    deleted: 'false',
    title: '제목없음',
    owner: userid,
    participants: [userid],
    createdtime: now,
    lasteditedtime: now,
    blocks: [],
    pages: [],
    font: 'default',
  });
  return result;
};

const addPagePipeline = async (userid) => {
  const result = await createPage(userid);
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.pageid = result.insertedId;
  return response;
};

const loadPagePipeline = async (userid, pageid) => {
  const page = getPageById(pageid);
  if (page !== null) {
    const authority = page.owner === userid || page.participant.includes(userid);
    if (authority) {
      const response = createResponse(responseMessage.PROCESS_SUCCESS);
      response.title = page.title;
      response.blocks = page.blocks;
      return response;
    }
    return createResponse(responseMessage.AUTH_FAIL);
  }
  return createResponse(responseMessage.PAGE_NOT_FOUND);
};

module.exports = { addPagePipeline, loadPagePipeline };
