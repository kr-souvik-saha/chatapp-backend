const express = require('express');
const {
    register,
    login,
    logout,
    profile
} = require('../controller/user');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile', profile);

exports.router = router