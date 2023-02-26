const User = require('../models/user');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'Переданы некорректные данные' });
      } else {
        throw new InternalServerError({ message: 'На сервере произошла ошибка' });
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      throw new InternalServerError({ message: 'На сервере произошла ошибка' });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new Error('Что-то пошло не так...'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Что-то пошло не так...') {
        throw new NotFoundError({ message: 'По переданному id отсутствуют данные' });
      }
      if (err.name === 'CastError') {
        throw new BadRequestError({ message: 'Переданы некорректные данные' });
      } else {
        throw new InternalServerError({ message: 'На сервере произошла ошибка' });
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'Переданы некорректные данные' });
      } else {
        throw new InternalServerError({ message: 'На сервере произошла ошибка' });
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'Переданы некорректные данные' });
      } else {
        throw new InternalServerError({ message: 'На сервере произошла ошибка' });
      }
    })
    .catch(next);
};
