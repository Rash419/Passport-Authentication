const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../model/User');

//welcome page
router.get('/',(req,res) => {
    res.render('welcome.ejs');
})

router.get('/dashboard', ensureAuthenticated, (req,res) => {
    res.render('dashboard.ejs', {name : req.user.name });
})

module.exports = router;