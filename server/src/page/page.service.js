const { createDocument, updateOneDocument } = require('../db/db.crud');
const dbconfig = require('../db.config.json');

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
  const page = {
    deleted: 'false',
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
  await updateOneDocument(dbconfig.COLLECTION_WORKSPACE, { owner: userid }, { $addToSet: { pages: result.insertedId } });

  const response = createResponse('success');
  response.pageid = result.insertedId;
  return response;
};

module.exports = { addPagePipeline };
