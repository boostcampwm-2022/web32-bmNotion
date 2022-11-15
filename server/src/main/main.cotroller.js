
const mainController = {
  Main: (req, res) => {
    res.sendFile(__dirname, '../../client/dist/index.html');
  }
}

module.exports = mainController;