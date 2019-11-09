const express = require('express');
const router = express.Router();
const helper = require('./helper');

router.get('/', (req, res, next) => {
  res.status(200).send('OK');
});

module.exports = router;