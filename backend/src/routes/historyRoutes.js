const express = require('express');
const router = express.Router();
const { getHistory, saveHistory } = require('../controllers/historyController');

router.get('/', getHistory);
router.post('/', saveHistory);

module.exports = router;
