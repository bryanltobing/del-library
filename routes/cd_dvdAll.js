const express = require('express');
const router = express.Router();
const { auth, notAuth, authRoleLibrarian } = require('../middleware/auth');
const moment = require('moment-timezone');

const CD = require('../models/cd_dvd');


router.get('/cd_dvd-list', async (req, res) => {
    try {
        const cd = await CD.find({});
        res.render('pages/cd_dvd', {
            title : "CD/DVD",
            data : cd,
            cdSuccess : req.flash('cdSuccess')
        });
    } catch(e) {
        console.log("error " + e);
    }
});


module.exports = router;