const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// models
const PinjamBuku = require('../models/pinjamBuku');

const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        await req.user.populate({
            path : 'pinjam_buku'
        }).execPopulate();
        res.render('pages/requestcard', {
            title : "Pinjam Buku",
            user : req.user,
            request : req.user.pinjam_buku,
            time : moment(req.user.pinjam_buku.createdAt).tz('Asia/Jakarta').format('LLLL'),
            successAdded : req.flash('successAdded'),
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
        console.log(pinjamBuku);
    } catch(e) {
        console.log("error " + e );
    }
});

module.exports = router;