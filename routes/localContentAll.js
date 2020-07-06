const express = require('express');
const router = express.Router();
const escapeRegex = require('../function/search');

const LocalContent = require('../models/local_content');

router.get('/localcontent-list', async (req, res) => {
    try {
        var limit = parseInt(req.query.limit);
        if(!limit){
            limit=7;
        }
        var localcontent;
        var count = 0;
        var regexJudul;
        var regexJenis;
        if(!req.query.keywords && !req.query.jenis) {
            localcontent = await LocalContent.find({}).limit(limit);
            count = await LocalContent.countDocuments();
        } else {
            regexJudul = new RegExp(escapeRegex(req.query.keywords) , 'gi');
            regexJenis = new RegExp(escapeRegex(req.query.jenis), 'gi');
            localcontent = await LocalContent.find({ $and : [ { judul : regexJudul }, { jenis : regexJenis } ] }).limit(limit);
            localcontentcount = await LocalContent.find({ $and : [ { judul : regexJudul }, { jenis : regexJenis } ] });
            count = localcontentcount.length;
        }
        res.render('pages/localcontent_list', {
            title : "Local Content",
            data : localcontent,
            count,
            keywords : {
                judul : req.query.keywords,
                jenis : req.query.jenis   
            },  
            limit,
            localContentSuccess : req.flash('localContentSuccess')
        });
        
    } catch(e) {
        res.redirect('/');
    }
});

module.exports = router;