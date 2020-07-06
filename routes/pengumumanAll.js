const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const escapeRegex = require('../function/search');

// models
const Pengumuman = require('../models/pengumuman');

router.get('/pengumuman-list', async (req, res) => {
    try {
        var pengumuman;
        var count;
        if(!req.query.keywords) {
            pengumuman = await Pengumuman.find({});
            count = await pengumuman.length;
            pengumuman.forEach((p) => {
                p.tanggal = moment(p.createdAt).tz('Asia/Jakarta').locale('id').format('LLLL').split(' ');
            });
        } else {
            const regex = new RegExp(escapeRegex(req.query.keywords), 'gi');
            pengumuman = await Pengumuman.find({$or : [ { judul : regex }, {konten : regex} ]} );
            count = await pengumuman.length;
            pengumuman.forEach((p) => {
                p.tanggal = moment(p.createdAt).tz('Asia/Jakarta').locale('id').format('LLLL').split(' ');
            });
        }
        res.render('pages/pengumuman', {
            title : "Pengumuman",
            data : pengumuman,
            error : req.flash('error'),
            deleted : req.flash('deleted'),
            keywords : req.query.keywords,
            count : count
        });
    } catch(e) {
        console.log("error " + e);
    }
});

router.get('/pengumuman-detail/:id', async (req, res) => {
    try {
        const detailPengumuman = await Pengumuman.findById(req.params.id);
        detailPengumuman.baru = detailPengumuman.konten.split('\n');
        detailPengumuman.tanggal = moment(detailPengumuman.createdAt).tz('Asia/Jakarta').locale('id').format('LLLL').split(' ');
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