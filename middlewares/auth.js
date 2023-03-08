const jwt = require('jsonwebtoken');
const { unauthorizedErrorCode } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(unauthorizedErrorCode).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    if (err.message === 'Authorization required') {
      res.status(unauthorizedErrorCode).send({ message: 'Необходима авторизация' });
    }
  }
  req.user = payload;
  return next();
};
