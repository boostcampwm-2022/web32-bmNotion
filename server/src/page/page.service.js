const { createDocument, readOneDocument } = require('../db/db.crud');
const createResponse = require('../utils/response.util');
const responseMessage = require('../response.message.json');
const dbConfig = require('../db.config.json');

const createPage = async (userid) => {
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

  const result = await createDocument(dbconfig.COLLECTION_PAGE, page);
  return result;
};

const addPagePipeline = async (userid) => {
  const result = await createPage(userid);
  await updateOneDocument(
    dbconfig.COLLECTION_WORKSPACE,
    { owner: userid },
    { $addToSet: { pages: result.insertedId } },
  );

  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.pageid = result.insertedId;
  return response;
};


const readPages = async (userid) => {
  const result = await readOneDocument(dbconfig.COLLECTION_WORKSPACE, { owner: userid });
  const pageList = await Promise.all(
    result.pages.map((pageId) => {
      const { title } = readOneDocument(dbconfig.COLLECTION_PAGE, { pageid: pageId });
      return {
        pageid: pageId,
        title,
      };
    }),
  );

  return pageList;
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

module.exports = { addPagePipeline, loadPagePipeline, readPages };
