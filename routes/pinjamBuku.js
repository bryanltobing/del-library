const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// models
const PinjamBuku = require('../models/pinjamBuku');
const User = require('../models/users');

const { auth, authRoleLibrarian } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        await req.user.populate({
            path : 'pinjam_buku'
        }).execPopulate();
        req.user.pinjam_buku.forEach((buku) => {
            buku.created = moment(buku.createdAt).fromNow(false);
            buku.batasPeminjaman = moment(buku.tanggalPengembalian).locale('id').fromNow(true);
            buku.kembali = moment(buku.tanggalPengembalian).locale('id').format('LL');
            if(buku.statusPinjam === '1') {
                if(new Date() > buku.tanggalPengembalian) {
                    buku.statusPinjam = '2'
                }
            }
        });
        res.render('pages/pinjamanbuku', {
            title : "Pinjam Buku",
            user : req.user,
            request : req.user.pinjam_buku,
            success : req.flash('success'),
            error : req.flash('error')
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

router.delete('/delete-pinjam/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const book = await PinjamBuku.findById(id);
        await book.deleteOne();
        req.flash('success', 'Request berhasil dihapus');
        res.redirect('/user/pinjamBuku');
    } catch(e) {
        req.flash('error', 'gagal ' + e);
        res.redirect('/user/pinjambuku');
    }
});

// List buku dipinjam
router.get('/list', auth, authRoleLibrarian, async (req, res) => {
    try {
        const pinjambuku = await PinjamBuku.find({});
        pinjambuku.forEach((buku) => {
            buku.created = moment(buku.createdAt).fromNow(false);
            buku.batasPeminjaman = moment(buku.tanggalPengembalian).locale('id').fromNow(true);
            buku.kembali = moment(buku.tanggalPengembalian).locale('id').format('LL');
            if(buku.statusPinjam === '1') {
                if(new Date() > buku.tanggalPengembalian) {
                    buku.statusPinjam = '2'
                }
            }
        });
        res.render('pages/pinjamanbuku_list', {
            title : "List Peminjam Buku",
            request : pinjambuku,
            success : req.flash('success'),
            error : req.flash('error')
        });
    } catch(e) {
        console.log("error" + e);
    }
}); 

router.patch('/list/approve/:id', auth, authRoleLibrarian, async(req, res) => {
    const id = req.params.id;
    try {
        const pinjam = await PinjamBuku.findByIdAndUpdate(id, { statusPinjam : "1", tanggalPengembalian : new Date().setDate(new Date().getDate() + 7) }, { new : true });
        req.flash('success', 'Berhasil disetujui');
        res.redirect('/user/pinjambuku/list');
    } catch(e) {
        req.flash('error', 'Gagal disetujui' + e);
        console.log("error " + e);
    }
});

router.patch('/list/reject/:id', auth, authRoleLibrarian, async(req, res) => {
    const id = req.params.id;
    try {
        const pinjam = await PinjamBuku.findByIdAndUpdate(id, { statusPinjam : "9" }, { new : true });
        const user = await User.findOneAndUpdate({ _id : pinjam.owner }, { $inc : { jumlahPinjaman : -1 } });
        req.flash('success', 'Request ditolak');
        res.redirect('/user/pinjambuku/list');
    } catch(e) {
        req.flash('error', 'Gagal menolak request ' + e);
        console.log("error " + e);
    }
});

router.patch('/list/complete/:id', auth, authRoleLibrarian, async(req, res) => {
    const id = req.params.id;
    try {
        const pinjam = await PinjamBuku.findByIdAndUpdate(id, { statusPinjam : "5" }, { new : true });
        const user = await User.findOneAndUpdate({ _id : pinjam.owner }, { $inc : { jumlahPinjaman : -1 } });
        req.flash('success', 'Marked as complete');
        res.redirect('/user/pinjambuku/list');
    } catch(e) {
        req.flash('error', 'Failed ' + e);
        console.log("error " + e);
    }
});



module.exports = router;