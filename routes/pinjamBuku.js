const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// models
const PinjamBuku = require('../models/pinjamBuku');
const User = require('../models/users');

const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        await req.user.populate({
            path : 'pinjam_buku'
        }).execPopulate();
        res.render('pages/pinjamanbuku', {
            title : "Pinjam Buku",
            user : req.user,
            request : req.user.pinjam_buku,
            time : moment(req.user.pinjam_buku.createdAt).fromNow(false),
            success : req.flash('success'),
            errorAdded : req.flash('errorAdded')
        });
    } catch(e) {
        console.log("Error " + e);
    }
});


router.post('/' , auth, async (req, res) => {
    const pinjamBuku = new PinjamBuku({
        ...req.body,
        owner : req.user._id
    });
    try {
        await pinjamBuku.save();
        req.flash('success', 'Request peminjaman berhasil dibuat');
        res.redirect('/user/pinjambuku');
    } catch(e) {
        req.flash('error', 'Request peminjaman gagal dibuat ' + e);
        res.redirect('/book-list');
    }
});

module.exports = router;