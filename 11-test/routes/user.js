const express = require('express');

const {isLoggedIn} = require('./middlewares');
const User = require('../models/user');
const { addFollwing } = require('../controllers/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, addFollwing);

module.exports=router;