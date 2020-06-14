const express = require('express');
const router = express.Router();
const passport = require('passport');

// Middleware
const { auth, notAuth } = require('../middleware/auth');

const Users = require('../models/users');

const initializePassport = require('../middleware/passport-config');
initializePassport (passport);

router.get('/login', (req, res) => {
    res.render('pages/login', {
        title : "Login - OLIS ITDEL"
    });
});

// router.get('/register', notAuth,  (req,res) => {
//     res.render('pages/register');
// });

// router.post('/register', notAuth, async (req,res) => {
//     const user = new Users(req.body);
//     try {
//         await user.save();
//         res.redirect('/user/login');
//     } catch (e) {
//         res.redirect('/user/register');
//     }
// });

router.post('/login', notAuth, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
}));

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/user/login');
});

module.exports = router;