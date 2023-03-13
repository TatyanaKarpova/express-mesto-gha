const router = require('express').Router();
const { celebrate, Joi, isCelebrateError } = require('celebrate');
const { validateUrl } = require('../utils/urlValidator');

const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');

router.get('/users', getUsers);
router.get('/users/me', getUser);

router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUserById,
).use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    next(new BadRequestError('Переданы некорректные данные'));
  } else {
    next(new InternalServerError('На сервере произошла ошибка'));
  }
});

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
).use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    next(new BadRequestError('Переданы некорректные данные'));
  } else {
    next(new InternalServerError('На сервере произошла ошибка'));
  }
});

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom(validateUrl),
    }),
  }),
  updateAvatar,
).use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    next(new BadRequestError('Переданы некорректные данные'));
  } else {
    next(new InternalServerError('На сервере произошла ошибка'));
  }
});

module.exports = router;
