const jwt = require('jsonwebtoken');
const { addPagePipeline, loadPagePipeline, readPagePipeline } = require('./page.service');

const pageController = {
  addPage: async (req, res) => {
    console.log(req.body);
    const { id: userid } = jwt.decode(req.headers.autorization);
    const resJson = await addPagePipeline(userid);
    res.json(resJson);
  },

  loadPage: async (req, res) => {
    const { pageid } = req.params;
    console.log(req.body);
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
