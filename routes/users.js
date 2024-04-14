const express = require('express');
//const conn = require('../mariadb');
//const { body, validationResult, param } = require('express-validator');
const router = express.Router();
//let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
router.use(express.json()); //json 형태로 사용
dotenv.config();

// 회원가입
router.post('/singup', (req, res) => {
  res.json('회원가입');
});

// 로그인
router.post('/login', (req, res) => {});

// 비밀번호 초기화 요청
router.post('/reset', (req, res) => {});

// 비밀번호 초기화
router.put('/reset', (req, res) => {});

module.exports = router;
