const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// models
const Pengumuman = require('../models/pengumuman');

router.get('/pengumuman-list', async (req, res) => {
    try {
        const pengumuman = await Pengumuman.find({});
        pengumuman.forEach((p) => {
            p.tanggal = moment(p.createdAt).tz('Asia/Jakarta').locale('id').format('LLLL').split(' ');
        })
        res.render('pages/pengumuman', {
            title : "Pengumuman",
            data : pengumuman
        });
    } catch(e) {
        console.log("error " + e);
    }
});


module.exports = router;