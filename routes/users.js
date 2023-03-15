const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('../utils/urlValidator');

const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getUser);

router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex()
        .rule({ message: 'Не удалось выполнить функцию getUserByI' }),
    }),
  }),
  getUserById,
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30)
        .rule({ message: 'Не удалось обновить имя пользователя' }),
      about: Joi.string().required().min(2).max(30)
        .rule({ message: 'Не удалось обновить описание пользователя' }),
    }),
  }),
  updateUser,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom(validateUrl)
        .rule({ message: 'Не удалось обновить аватар пользователя' }),
    }),
  }),
  updateAvatar,
);

module.exports = router;
