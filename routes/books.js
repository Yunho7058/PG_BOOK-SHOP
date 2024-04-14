const express = require('express');
//const conn = require('../mariadb');
//const { body, validationResult, param } = require('express-validator');
const router = express.Router();
//let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
router.use(express.json()); //json 형태로 사용
dotenv.config();

// 전체도서 조회
router.get('/', (req, res) => {});

// 개별 도서 조회
router.get('/:id', (req, res) => {});

// 카테고리별 조회
router.get('/reset', (req, res) => {
  //req.query.category
});

module.exports = router;
