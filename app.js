const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
  celebrate,
  Joi, errors,
  isCelebrateError,
} = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateUrl } = require('./utils/urlValidator');
const BadRequestError = require('./errors/BadRequestError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateUrl),
    }),
  }),
  createUser,
);

app.use(auth);
app.use(errors());

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  let details;

  if (isCelebrateError(err)) {
    details = new BadRequestError('Переданы некорректные данные');
  } else {
    details = err;
  }

  const { statusCode = 500, message = '' } = details;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb').then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
