const express = require('express');
const router = express.Router();

const LocalContent = require('../models/local_content');

router.get('/localcontent-list', async (req, res) => {
    try {
        var limit = parseInt(req.query.limit);
        if(!limit){
            limit=7;
        }
        const localcontent = await LocalContent.find({}).limit(limit);
        const count = await LocalContent.countDocuments();
        res.render('pages/localcontent_list', {
            title : "Local Content",
            data : localcontent,
            count,
            limit,
            localContentSuccess : req.flash('localContentSuccess')
        });
    } catch(e) {
        res.redirect('/');
    }
});

module.exports = router;