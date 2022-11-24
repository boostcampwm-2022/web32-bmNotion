const { readOneDocument, updateOneDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');
const createResponse = require('../utils/response.util');
const responseMessage = require('../response.message.json');

const getPageById = async (pageid) => {
  const page = await readOneDocument(dbConfig.COLLECTION_PAGE, { _id: pageid });
  return page;
};

const checkPageAuthority = (page, userid) => page.participants.includes(userid);

const editblock = async (pageid, blocks) => {
  await updateOneDocument(dbConfig.COLLECTION_PAGE, { _id: pageid }, { $set: { blocks } });
};

const editPipeline = async (userid, pageid, blocks) => {
  const page = await getPageById(pageid);
  if (page === null) return createResponse(responseMessage.PAGE_NOT_FOUND);
  const isParticipant = checkPageAuthority(page, userid);
  if (isParticipant) {
    await editblock(pageid, blocks);
    return createResponse(responseMessage.PROCESS_SUCCESS);
  }
  return createResponse(responseMessage.AUTH_FAIL);
};

module.exports = { editPipeline };
