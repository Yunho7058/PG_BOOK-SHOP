const express = require('express');
//const conn = require('../mariadb');
//const { body, validationResult, param } = require('express-validator');
const router = express.Router();
//let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
router.use(express.json()); //json 형태로 사용
dotenv.config();
const { likeAdd, likeRemove } = require('../controller/LikesController');

router.post('/', likeAdd);

router.delete('/:id', likeRemove);

module.exports = router;
