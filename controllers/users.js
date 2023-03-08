const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  badRequestErrorCode,
  internalServerErrorCode,
  notFoundErrorCode,
  unauthorizedErrorCode,
  successCode,
  conflictErrorCode,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          const newUser = user.toObject();
          delete newUser.password;
          res.send({ data: newUser });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(badRequestErrorCode).send({ message: 'Переданы некорректные данные' });
            return;
          }
          if (err.code === 11000) {
            res.status(conflictErrorCode).send({ message: 'Пользователем с такими e-mail уже существует' });
          } else {
            res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
          }
        });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundErrorCode).send({ message: 'Пользователь не найден' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => { res.status(notFoundErrorCode).send({ message: 'По переданному id отсутствуют данные' }); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestErrorCode).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestErrorCode).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestErrorCode).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials({ email, password })
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      });
      res.status(successCode).send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => {
      if (err.message === 'AuthError') {
        res.status(unauthorizedErrorCode).send({ message: 'При авторизации переданы некорректные почта или пароль' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
