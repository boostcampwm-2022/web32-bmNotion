const jwt = require('jsonwebtoken');
const {
  addPagePipeline,
  loadPagePipeline,
  readPagePipeline,
  editPagePipeline,
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
    const resJson = await addPagePipeline(userid);
    res.json(resJson);
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
};

module.exports = pageController;
