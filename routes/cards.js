const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
const { validateUrl } = require('../utils/urlValidator');

const {
  createCard,
  getCards,
  deleteCard,
  putLike,
  removeLike,
} = require('../controllers/cards');

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30)
        .rule({ message: 'Некорректно заполнено поле card.name' }),
      link: Joi.string().required().min(2).custom(validateUrl)
        .rule({ message: 'Некорректно заполнено поле card.link' }),
    }),
  }),
  createCard,
);

router.get('/cards', getCards);

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex()
        .rule({ message: 'Не удалось удалить карточку' }),
    }),
  }),
  deleteCard,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex()
        .rule({ message: 'Не удалось поставить лайк' }),
    }),
  }),
  putLike,
);

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex()
        .rule({ message: 'Не удалось снять лайк' }),
    }),
  }),
  removeLike,
);

module.exports = router;
