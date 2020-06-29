const express = require('express');
const router = express.Router();

// models
const CD = require('../models/cd_dvd');

// middleware
const { auth, authRoleLibrarian } = require('../middleware/auth');

router.get('/add-dvd', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/addcd_dvd', {
        title : "Add Data CD and DVD"
    });
});

router.post('/add-dvd', auth, authRoleLibrarian, async (req, res) => {
    const cd = new CD({
        ...req.body,
        uploader : req.user._id
    });

    try {
        await cd.save();
        req.flash('cdSuccess', 'Data berhasil ditambahkan');
        res.redirect('/cd_dvd-list');
    } catch(e) {
        console.log("error" + e);
        res.redirect('/user/add-dvd');
    }
});

module.exports = router;