const { readOneDocument, updateOneDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');

const getPageById = async (pageid) => {
  const page = await readOneDocument(dbConfig.COLLECTION_PAGE, { _id: pageid });
  return page;
};

const checkPageAuthority = (page, userid) => page.participants.includes(userid);

const editblock = async (pageid, blocks) => {
  await updateOneDocument(dbConfig.COLLECTION_PAGE, { _id: pageid }, { $set: { blocks } });
};

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
    case 'page is not exist':
      response.code = '404';
      response.message = 'NonExistentPageError';
      break;
    default:
      break;
  }
  return response;
};

const editPipeline = async (userid, pageid, blocks) => {
  const page = await getPageById(pageid);
  if (page === null) return createResponse('page is not exist');
  const isParticipant = checkPageAuthority(page, userid);
  if (isParticipant) {
    await editblock(pageid, blocks);
    return createResponse('success');
  }
  return createResponse('unauthorized user');
};

module.exports = { editPipeline };
