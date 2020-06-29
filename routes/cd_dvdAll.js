const express = require('express');
const router = express.Router();
const { auth, notAuth, authRoleLibrarian } = require('../middleware/auth');
const Cards = require('../models/card_request');
const moment = require('moment-timezone');


router.get('/cd_dvd-list', (req, res) => {
    res.render('pages/cd_dvd', {
        title : "CD/DVD"
    });
});


module.exports = router;