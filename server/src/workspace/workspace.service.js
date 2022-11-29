const { readAllDocument } = require('../db/db.crud');
const dbConfig = require('../db.config.json');

const readWorkspaceById = async (userId) => {
  const queryCriteria = {
    $or: [{ owner: userId }, { members: { $elemMatch: { userId: userId } } }],
  };
  const workspaceList = await readAllDocument(dbConfig.COLLECTION_WORKSPACE, queryCriteria);
  console.log(workspaceList);
  return workspaceList;
};

module.exports = {
  readWorkspaceById,
};
