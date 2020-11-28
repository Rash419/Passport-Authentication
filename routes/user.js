const express = require('express');
const router = express.Router();
const userModel = require('../model/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//Login
router.get('/login', (req, res) => {
    res.render('login.ejs');
})

//Register
router.get('/register', (req, res) => {
    res.render('register.ejs');
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;

    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fills all field' });
    }

    //check password match
    if (password !== password2) {
        errors.push({ msg: 'password does not match' });
    }

    //check passlength
    if (password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 characters' });
    }

    if (errors.length === 0) {
        //validation passed
        userModel.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'email is already registered' });
                    res.render('register', { errors, name, email, password, password2 });
                }
                else {
                    const newUser = new userModel({
                        name,
                        email,
                        password,
                    })

                    //hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                throw err;
                            }
                            newUser.password = hash;
                            newUser.save((err) => {
                                if (err) { console.log(err) }
                                else {
                                    req.flash('success_msg', 'You are now registered can login');
                                    res.redirect('/users/login');
                                }
                            });
                        })
                    })
                }


            });
    } else {
        res.render('register', { errors, name, email, password, password2 });
    }
})

router.post('/login', (req,res,next) => {
    passport.authenticate('local', { successRedirect : '/dashboard' ,
                                     failureRedirect : '/users/login' ,
                                     failureFlash : true })(req,res,next)


})

router.get('/logout' ,(req,res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})
module.exports = router;