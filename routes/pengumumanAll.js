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

router.get('/pengumuman-detail/:id', async (req, res) => {
    try {
        const detailPengumuman = await Pengumuman.findById(req.params.id);
        detailPengumuman.baru = detailPengumuman.konten.split('\n');
        console.log(detailPengumuman.baru);
        detailPengumuman.forEach((p) => {
            p.tanggal = moment(p.createdAt).tz('Asia/Jakarta').locale('id').format('LLLL').split(' ');
        });
        res.render('pages/pengumumandetail', {
            title : 'Pengumuman - Detail',
            data : detailPengumuman,
            message : req.flash('messageAddPengumuman'),
        });
    } catch(e) {
        req.flash('pengumumanDetailError' ,'Pengumuman tidak ditemukan');
        res.redirect('/pengumuman-list');
    }
});

module.exports = router;