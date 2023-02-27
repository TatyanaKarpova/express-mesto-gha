const Card = require('../models/card');
const { badRequestErrorCode, internalServerErrorCode, notFoundErrorCode } = require('../utils/constants');

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestErrorCode).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(notFoundErrorCode).send({ message: 'По переданному id отсутствуют данные' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestErrorCode).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.putLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(() => { res.status(notFoundErrorCode).send({ message: 'По переданному id отсутствуют данные' }); })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestErrorCode).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.removeLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail(() => { res.status(notFoundErrorCode).send({ message: 'По переданному id отсутствуют данные' }); })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestErrorCode).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(internalServerErrorCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
