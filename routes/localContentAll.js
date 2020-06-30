const express = require('express');
const router = express.Router();

const LocalContent = require('../models/local_content');

router.get('/localcontent-list', async (req, res) => {
    try {
        const localcontent = await LocalContent.find({});
        res.render('pages/localcontent_list', {
            title : "Local Content",
            data : localcontent,
            localContentSuccess : req.flash('localContentSuccess')
        });
    } catch(e) {
        res.redirect('/');
    }
})

module.exports = router;