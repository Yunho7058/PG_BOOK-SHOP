const express = require('express');
const router = express.Router();

const { allCategoryLoad } = require('../controller/CategotyController');

router.get('/', allCategoryLoad);

module.exports = router;
