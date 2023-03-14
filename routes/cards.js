const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
        .error(new Error('Некорректно заполнено поле card.name')),
      link: Joi.string().required().min(2).custom(validateUrl)
        .error(new Error('Некорректно заполнено поле card.link')),
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
        .error(new Error('Не удалось удалить карточку')),
    }),
  }),
  deleteCard,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex()
        .error(new Error('Не удалось поставить лайк')),
    }),
  }),
  putLike,
);

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex()
        .error(new Error('Не удалось снять лайк')),
    }),
  }),
  removeLike,
);

module.exports = router;
