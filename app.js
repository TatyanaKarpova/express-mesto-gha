const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const { createUser, getUsers, getUserById } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
