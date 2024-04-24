//문윤호

const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
let dotenv = require('dotenv');
dotenv.config();

const singup = (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(64).toString('base64');
  const hashPwd = crypto
    .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
    .toString('base64');
  // pbkdf2Sync (비밀번호,salt,해쉬함수를 반복하는 함수 ,키 길이,알고리즘 )
  conn.query(
    `INSERT INTO users(email, password,salt) VALUES (?,?,?)`,
    [email, hashPwd, salt],
    (err, results) => {
      if (err) {
        //res.status(StatusCodes.BAD_REQUEST).end()
        throw err;
      }
      return res.status(StatusCodes.CREATED).json({
        message: `${email}님 환영합니다.`,
      });
    }
  );
};

const login = (req, res) => {
  const { email, password } = req.body;

  conn.query(`SELECT * FROM users WHERE email =?`, email, (err, results) => {
    let loginUser = results[0];
    const hashPwd = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512')
      .toString('base64');
    if (loginUser && loginUser.password === hashPwd) {
      const token = jwt.sign(
        { id: loginUser.id, email: loginUser.email },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '5m',
          issuer: 'yunho',
        }
      );
      res.cookie('token', token, { httpOnly: true });
      res.status(StatusCodes.OK).json({
        message: `${loginUser.email}님 환영합니다.`,
        //token: token,
      });
      console.log(token);
    }
  });
};

const pwdResetRequst = (req, res) => {
  const { email } = req.body;
  conn.query(`SELECT * FROM users WHERE email =?`, [email], (err, results) => {
    if (err) {
      //res.status(StatusCodes.UNAUTHORIZED).end()
      throw err;
    }
    return res.status(StatusCodes.OK).json({
      email: email,
      message: `비밀번호를 변경하실수 있습니다.`,
    });
  });
};

const pwdReset = (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(64).toString('base64');
  const hashPwd = crypto
    .pbkdf2Sync(password, salt, 10000, 10, 'sha512')
    .toString('base64');

  conn.query(
    `UPDATE users SET password=?, salt=? WHERE email=?`,
    [hashPwd, salt, email],
    (err, results) => {
      if (err) {
        throw err;
      }
      if (results.affectedRows === 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.CREATED).json({
        message: `비밀번호가 변경되었습니다`,
      });
    }
  );
};

module.exports = { singup, login, pwdReset, pwdResetRequst };
