const { createDocument } = require('../db/db.crud');

const createResponse = (message) => {
  const response = { code: '500', message: '' };
  switch (message) {
    case 'success':
      response.code = '202';
      response.message = 'success';
      break;
    case 'unauthorized user':
      response.code = '404';
      response.message = 'UnauthorizedUserError';
      break;
    case 'invalid pageid':
      response.code = '404';
      response.message = 'NonExistentPageError';
      break;
    default:
      break;
  }
  return response;
};

const getPageById = async (pageid) => {
  const page = await readOneDocument(dbConfig.COLLECTION_PAGE, { _id: pageid });
  return page;
};

const createPage = async (userid) => {
  const now = new Date().toUTCString();
  const result = await createDocument('page', {
    deleted: 'false',
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
  const response = createResponse('success');
  response.pageid = result.insertedId;
  return response;
};

const loadPagePipeline = async (userid, pageid) => {
  const page = getPageById(pageid);
  if (page !== null) {
    const authority = page.owner === userid || page.participant.includes(userid);
    if (authority) {
      const response = createResponse('success');
      response.title = page.title;
      response.blocks = page.blocks;
      return response;
    }
    return createResponse('UnauthorizedUserError');
  }
  return createResponse('NonExistentPageError');
};

module.exports = { addPagePipeline, loadPagePipeline };
