const express = require('express');
const { protected, authorize } = require('../middlewares/auth');

const {
    getUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
} = require('../controllers/users');
const router = express.Router();

router.get('/', protected, getUsers);
router.get('/:id', protected, getUser);
router.post('/', protected, authorize, addUser);
router.put('/:id', protected, authorize, updateUser);
router.delete('/:id', protected, authorize, deleteUser);

module.exports = router;
