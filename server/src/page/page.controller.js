const jwt = require('jsonwebtoken');
const createResponse = require('../utils/response.util');
const responseMessage = require('../response.message.json');
const { workspaceCrud } = require('../workspace/workspace.service');
const {
  addPagePipeline,
  loadPagePipeline,
  readPagePipeline,
  editPagePipeline,
  deletePagePipeline,
} = require('./page.service');

const pageController = {
  editPage: async (req, res) => {
    const { id: userid } = jwt.decode(req.headers.authorization);
    const { pageid, blocks, title } = req.body;
    const resJson = await editPagePipeline(userid, title, pageid, blocks);
    res.json(resJson);
  },
  addPage: async (req, res) => {
    const { id: userid } = jwt.decode(req.headers.authorization);
    const { workspace: workspaceid } = req.body;
    const workspace = await workspaceCrud.readWorkSpaceById(workspaceid);
    if (!workspace.members.includes(userid))
      return res.json(createResponse(responseMessage.AUTH_FAIL));
    const resJson = await addPagePipeline(userid, workspaceid);
    return res.json(resJson);
  },
  loadPage: async (req, res) => {
    const { pageid } = req.params;
    const { id: userid } = jwt.decode(req.headers.authorization);
    const resJson = await loadPagePipeline(userid, pageid);
    res.json(resJson);
  },
  readPages: async (req, res) => {
    const { workspaceid } = req.params;
    const resJson = await readPagePipeline(workspaceid);

    res.json(resJson);
  },
  deletePage: async (req, res) => {
    const { id: userid } = jwt.decode(req.headers.authorization);
    const { workspaceid, pageid } = req.params;
    const workspace = await workspaceCrud.readWorkSpaceById(workspaceid);
    if (!workspace.members.includes(userid))
      return res.Json(createResponse(responseMessage.AUTH_FAIL));
    const resJson = await deletePagePipeline(pageid);
    return res.json(resJson);
  },
};

module.exports = pageController;
