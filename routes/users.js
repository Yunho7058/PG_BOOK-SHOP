const express = require('express');
//const { body, validationResult, param } = require('express-validator');
const router = express.Router();
const {
  singup,
  login,
  pwdReset,
  pwdResetRequst,
} = require('../controller/UserController');
//let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');
router.use(express.json()); //json 형태로 사용
dotenv.config();

router.post('/singup', singup);

router.post('/login', login);

router.post('/reset', pwdResetRequst);

router.put('/reset', pwdReset);

module.exports = router;
