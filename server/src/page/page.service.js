const { createDocument } = require('../db/db.crud');

const createResponse = (message) => {
  const response = { code: '500', message: '' };
  switch (message) {
    case 'success':
      response.code = '202';
      response.message = 'success';
      break;
    default:
      break;
  }
  return response;
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

module.exports = { addPagePipeline };
