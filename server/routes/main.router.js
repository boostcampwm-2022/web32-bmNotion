const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.sendFile(__dirname, '../../client/dist/index.html');
});

module.exports = router;
