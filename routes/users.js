const router = require('express').Router();
const { createUser, getUsers, getUserById } = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);

module.exports = router;
