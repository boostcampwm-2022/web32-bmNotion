/* eslint no-underscore-dangle: 0 */
const { ObjectId } = require('mongodb');
const {
  createDocument,
  updateOneDocument,
  readOneDocument,
  writeBulk,
  saveTaskBulk,
} = require('../db/db.crud');
const createResponse = require('../utils/response.util');
const responseMessage = require('../response.message.json');
const dbConfig = require('../db.config.json');

const createAddQuery = (pageid, edits, title) => {
  const createTasks = edits.filter((edit) => edit.task === 'create');
  if (createTasks.length === 0) return [];
  const query = {
    updateOne: {
      filter: {
        _id: ObjectId(pageid),
      },
      update: {
        $set: { title },
        $addToSet: {
          blocks: {
            $each: [],
          },
        },
      },
    },
  };
  createTasks.forEach((edit) => {
    const { blockId, content, createdAt, index, type } = edit;
    const block = { blockId, content, createdAt, index, type };
    query.updateOne.update.$addToSet.blocks.$each.push(block);
  });
  return [query];
};

const getAscii = (idx) => {
  const charCount = idx / 26;
  const charIdx = idx % 26;
  return String.fromCharCode(97 + charIdx).repeat(charCount + 1);
};

const createSetQuery = (pageid, edits, title) => {
  const editTasks = edits.filter((edit) => edit.task === 'edit');
  if (editTasks.length === 0) return [];
  const query = {
    updateOne: {
      filter: {
        _id: ObjectId(pageid),
      },
      update: {
        $set: { title },
      },
      arrayFilters: [],
    },
  };
  edits.forEach((edit, idx) => {
    const { blockId, content, index, type } = edit;
    const arrayFilter = {};
    const filterFieldName = getAscii(idx);
    const filterName = `${filterFieldName}.blockId`;
    arrayFilter[filterName] = blockId;
    query.updateOne.arrayFilters.push(arrayFilter);
    query.updateOne.update.$set[`blocks.$[${filterFieldName}].content`] = content;
    query.updateOne.update.$set[`blocks.$[${filterFieldName}].index`] = index;
    query.updateOne.update.$set[`blocks.$[${filterFieldName}].type`] = type;
  });
  return [query];
};

const createPullQuery = (pageid, edits, title) => {
  const deleteTasks = edits.filter((edit) => edit.task === 'delete');
  if (deleteTasks.length === 0) return [];
  const query = {
    updateOne: {
      filter: {
        _id: ObjectId(pageid),
      },
      update: {
        $set: { title },
        $pull: { blocks: { blockId: { $in: [] } } },
      },
    },
  };
  edits.forEach((edit) => {
    const { blockId } = edit;
    query.updateOne.update.$pull.blocks.blockId.$in.push(blockId);
  });
  return [query];
};

const createQueryBulk = (pageid, edits, title) => [
  ...createAddQuery(pageid, edits, title),
  ...createSetQuery(pageid, edits, title),
  ...createPullQuery(pageid, edits, title),
];

const pageCrud = {
  createPage: async (userid) => {
    const now = new Date().toUTCString();
    const page = {
      deleted: false,
      title: '',
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
    if (pageid === ('' || 'list' || 'delete'))
      return createResponse(responseMessage.PAGE_NOT_FOUND);
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
  updatePageInfo: async (pageid, userid) => {
    const now = new Date().toUTCString();
    await updateOneDocument(
      dbConfig.COLLECTION_PAGE,
      { _id: ObjectId(pageid) },
      { $set: { lasteditedtime: now }, $addToSet: { participants: userid } },
    );
  },
  deletePage: async (pageid) => {
    await updateOneDocument(
      dbConfig.COLLECTION_PAGE,
      { _id: ObjectId(pageid) },
      { $set: { deleted: true } },
    );
  },
  updateTasks: async (pageid, tasks, title, userid, sse) => {
    const query = createQueryBulk(pageid, tasks, title);
    // const bulks = createBulk(pageid, tasks, title);
    const queueData = { pageid, tasks, query, userid, sse, title };
    saveTaskBulk(queueData);
  },
};

const checkPageAuthority = (page, userid) => page.participants.includes(userid);

const editPagePipeline = async (userid, title, pageid, tasks, sse) => {
  const page = await pageCrud.readPageById(pageid);
  if (page === null) return createResponse(responseMessage.PAGE_NOT_FOUND);
  // const isParticipant = checkPageAuthority(page, userid);
  // if (!isParticipant) return createResponse(responseMessage.AUTH_FAIL);
  if (tasks.length > 0) await pageCrud.updateTasks(pageid, tasks, title, userid, sse);
  return createResponse(responseMessage.PROCESS_SUCCESS);
};

const selectLastEditedPage = (pages) =>
  pages.reduce((pre, cur) => {
    const { _id: pageid, lasteditedtime } = cur;
    const curTime = Date.parse(lasteditedtime);
    if (pre === undefined) return { pageid, time: curTime };
    return pre.time > curTime ? pre : { pageid, time: curTime };
  }, undefined);

const selectLastEditedPageId = async (pageIds) => {
  const pages = await pageCrud.readPages(pageIds);
  return selectLastEditedPage(pages).pageid;
};

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
    const pageInfo = { title: page.title, id: page._id, deleted: page.deleted };
    return pageInfo;
  });
  return response;
};

const loadPagePipeline = async (userid, pageid) => {
  const page = await pageCrud.readPageById(pageid);
  if (page === null) return createResponse(responseMessage.PAGE_NOT_FOUND);
  // const authority = page.owner === userid || page.participants.includes(userid);
  // if (!authority) return createResponse(responseMessage.AUTH_FAIL);
  const response = createResponse(responseMessage.PROCESS_SUCCESS);
  response.title = page.title;
  response.blocks = page.blocks;
  return response;
};

const deletePagePipeline = async (pageid) => {
  const page = await pageCrud.readPageById(pageid);
  if (page === null) return createResponse(responseMessage.PAGE_NOT_FOUND);
  await pageCrud.deletePage(pageid);
  return createResponse(responseMessage.PROCESS_SUCCESS);
};

module.exports = {
  addPagePipeline,
  loadPagePipeline,
  readPagePipeline,
  editPagePipeline,
  deletePagePipeline,
  pageCrud,
  selectLastEditedPage,
  selectLastEditedPageId,
};
