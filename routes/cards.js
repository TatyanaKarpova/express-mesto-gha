const router = require('express').Router();
const { celebrate, CelebrateError, Joi } = require('celebrate');
const { validateUrl } = require('../utils/urlValidator');

const {
  createCard,
  getCards,
  deleteCard,
  putLike,
  removeLike,
} = require('../controllers/cards');

const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const { messages } = require('../utils/messages');

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(2).custom(validateUrl),
    }),
  }),
  createCard,
).use((err) => {
  if (err.name === 'ValidationError') {
    throw new CelebrateError(messages.badRequest);
  } else {
    throw new CelebrateError(messages.internal);
  }
});

router.get('/cards', getCards);

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteCard,
).use((err, req, res, next) => {
  if (err.name === 'CastError') {
    next(new BadRequestError('Переданы некорректные данные'));
  } else {
    next(new InternalServerError('На сервере произошла ошибка'));
  }
});

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  putLike,
).use((err, req, res, next) => {
  if (err.name === 'CastError') {
    next(new BadRequestError('Переданы некорректные данные'));
  } else {
    next(new InternalServerError('На сервере произошла ошибка'));
  }
});

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  removeLike,
).use((err, req, res, next) => {
  if (err.name === 'CastError') {
    next(new BadRequestError('Переданы некорректные данные'));
  } else {
    next(new InternalServerError('На сервере произошла ошибка'));
  }
});

module.exports = router;
