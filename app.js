const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { notFoundErrorCode } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().regex(/^(https?:\/\/)?(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/),
    }),
  }),
  createUser,
);

app.use(auth);
app.use(errors());

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(notFoundErrorCode).send({ message: 'По переданному id отсутствуют данные' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
