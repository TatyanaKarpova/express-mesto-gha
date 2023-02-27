const User = require('../models/user');
const { badRequestErrorCode, internalServerErrorCode, notFoundErrorCode } = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestErrorCode).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
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
