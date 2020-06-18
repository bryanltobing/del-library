const express = require('express');
const router = express.Router();
const passport = require('passport');

// Middleware
const { auth, notAuth } = require('../middleware/auth');

// Models
const Users = require('../models/users');
const Cards = require('../models/card_request');

const initializePassport = require('../middleware/passport-config');
initializePassport (passport);

router.get('/login', notAuth, (req, res) => {
    res.render('pages/login', {
        title : "Login - OLIS ITDEL"
    });
});

router.get('/register', notAuth,  (req,res) => {
    res.render('pages/register');
});

router.post('/register', notAuth, async (req,res) => {
    const user = new Users(req.body);
    try {
        await user.save();
        res.redirect('/user/login');
    } catch (e) {
        res.redirect('/user/register');
    }
});

router.post('/login', notAuth, passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    successFlash : true,
    failureRedirect: '/user/login',
    failureFlash: true,
}));

router.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/user/login');
});

// ----------------- DASHBOARD -------------------- //
router.get('/dashboard', auth, (req, res) => {
    res.render('pages/dashboard', {
        title : "Dashboard",
        name : req.user.fullname,
        user : req.user
    });
});

router.get('/profil', auth, (req, res) => {
    res.render('pages/userprofil', {
        title : "Profil",
        user : req.user
    });
});

router.get('/request-library-card', auth , (req, res) => {
    res.render('pages/requestcard', {
        title : "Request Card",
        user : req.user,
        successAdded : req.flash('successAdded'),
        errorAdded : req.flash('errorAdded')
    });
});

router.post('/request-library-card', auth , async (req, res) => {
    const cards = new Cards({
        ...req.body,
        owner : req.user._id,
    });

    try {
        await cards.save();
        req.flash('successAdded', 'Data Successfully Added');
        res.redirect('/user/request-library-card');
    } catch (e) {
        req.flash('errorAdded', 'Data Failed Added');
        res.redirect('/user/request-library-card');
    }
    
});

module.exports = router;