const express = require('express');
const router = express.Router();

const { auth, authRoleLibrarian } = require('../middleware/auth');

// models
const Localcontent = require('../models/local_content');

router.get('/add-localcontent', auth, authRoleLibrarian, async (req, res) => {
    try {
        res.render('pages/addlocal_content', {
            title : "Add Local Content"
        })
    } catch(e) {
        console.log("Error " + e);
    }
});

router.post('/add-localcontent', auth, authRoleLibrarian, async (req, res) => {
    try {
        const localcontent = new Localcontent({
            ...req.body
        })
        await localcontent.save();
        req.flash('localContentSuccess', 'Data Berhasil Ditambahkan');
        res.redirect('/localcontent-list');
    } catch(e) {
        console.log("Error " + e);
    }
});

module.exports = router;