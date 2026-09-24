const express = require('express');
const router = express.Router();
const { getUserCredits } = require('../controllers/userController');

router.get('/credits', getUserCredits);

module.exports = router;
