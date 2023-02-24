const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  const { userId } = req.params;

  Card.findByIdAndRemove(userId)
    .then((card) => res.status(200).send({ message: 'Карточка удалена' }))
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};
