const express = require('express');
//const conn = require('../mariadb');
//const { body, validationResult, param } = require('express-validator');
const router = express.Router();
//let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
router.use(express.json()); //json 형태로 사용
dotenv.config();

// 좋아요 추가
router.post('/:id', (req, res) => {
  res.json('회원가입');
});

// 삭제
router.delete('/:id', (req, res) => {});

module.exports = router;
