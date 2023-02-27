const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { notFoundErrorCode } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '63f8a58f7670818b748c292c',
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(notFoundErrorCode).send({ message: 'По переданному id отсутствуют данные' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
