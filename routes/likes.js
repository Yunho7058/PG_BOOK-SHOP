//문윤호
const express = require('express');
const router = express.Router();
let dotenv = require('dotenv');
router.use(express.json()); //json 형태로 사용
dotenv.config();
const { likeAdd, likeRemove } = require('../controller/LikesController');

router.post('/:id', likeAdd);

router.delete('/:id', likeRemove);

module.exports = router;
