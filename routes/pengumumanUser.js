const express = require('express');
const router = express.Router();

const { auth, authRoleLibrarian } = require('../middleware/auth');

// models
const Pengumuman = require('../models/pengumuman');

router.get('/add-pengumuman', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/addpengumuman' , {
        title : "Add Pengumuman",
        author : req.user.fullname
    });
});

router.post('/add-pengumuman', auth, authRoleLibrarian, async (req, res) => {
    try {
        const pengumuman = new Pengumuman({
            ...req.body,
            author : req.user.fullname
        });
        await pengumuman.save();
        req.flash('messageAddPengumuman', 'Pengumuman berhasil ditambahkan');
        res.redirect(`/pengumuman-detail/${pengumuman._id}`);
    } catch(e) {
        console.log("error" + e);
    }
});

module.exports = router;