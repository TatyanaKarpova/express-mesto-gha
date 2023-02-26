const Card = require('../models/card');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные' }));
      } else {
        next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError({ message: 'По переданному id отсутствуют данные' }));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные' }));
      } else {
        next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
      }
    });
};

module.exports.putLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(() => { throw new Error('Что-то пошло не так...'); })
    .then((card) => res.send(card))
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

module.exports.removeLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail(() => { throw new Error('Что-то пошло не так...'); })
    .then((card) => res.send(card))
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
