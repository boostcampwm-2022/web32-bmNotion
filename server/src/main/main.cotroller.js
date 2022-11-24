const path = require('path');

const mainController = {
  Main: (req, res) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
  },
  directUrlAccess: (req, res, next) => {
    if (req.get('Content-Type') === undefined) {
      res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
    } else {
      next();
    }
  },
};

module.exports = mainController;
