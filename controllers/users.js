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
        next(new BadRequestError({ message: 'Переданы некорректные данные' }));
      } else {
        next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new Error('Что-то пошло не так...'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Что-то пошло не так...') {
        next(new NotFoundError({ message: 'По переданному id отсутствуют данные' }));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные' }));
      } else {
        next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные' }));
      } else {
        next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные' }));
      } else {
        next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
      }
    });
};
