const express = require('express');
const router = express.Router();
const { auth, notAuth, authRoleLibrarian } = require('../middleware/auth');
const moment = require('moment-timezone');
const escapeRegex = require('../function/search');

const CD = require('../models/cd_dvd');


router.get('/cd_dvd-list', async (req, res) => {
    try {
        if(!req.query.keywords) {
            const cd = await CD.find({});
            return res.render('pages/cd_dvd', {
                title : "CD/DVD",
                data : cd,
                cdSuccess : req.flash('cdSuccess'),
                keywords : req.query.keywords,
                count : cd.length
            });
        } 
        const regex = new RegExp(escapeRegex(req.query.keywords), 'gi');
        const cd = await CD.find({ $or : [ { judul : regex }, { sumber : regex } , { keterangan : regex } ] });
        res.render('pages/cd_dvd', {
            title : "CD/DVD",
            data : cd,
            cdSuccess : req.flash('cdSuccess'),
            keywords : req.query.keywords,
            count : cd.length
        });
    } catch(e) {
        console.log("error " + e);
    }
});


module.exports = router;