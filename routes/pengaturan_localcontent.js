const express = require('express');
const router = express.Router();

const LocalContent = require('../models/local_content');

// function
const escapeRegex = require('../function/search');

router.get('/localcontent', async(req, res) => {
    let perpage = 6;
    let page = 1;
    let localcontent, count;
    try {
        if(!req.query.keywords) {
            localcontent = await LocalContent.find({}).skip((perpage*page) - (perpage)).limit(perpage);
            count = await LocalContent.countDocuments();
        } else {
            let regex = new RegExp(escapeRegex(req.query.keywords), 'gi');
            localcontent = await LocalContent.find({ judul : regex }).skip((perpage*page) - (perpage)).limit(perpage);
            count = await LocalContent.find({ judul : regex }).countDocuments();
        }
        res.render('pages/pengaturan_localcontent', {
            title : "Pengaturan - Local Content",
            data : localcontent,
            current : page,
            count : count,
            pages : Math.ceil(count/perpage),
            keywords : req.query.keywords,
            messageUpdate : req.flash('messageUpdate'),
            updateError : req.flash('updateError'),
            Removed : req.flash('Removed')
        });
    }
    catch(e) {
        console.log("Error " + e);
    }
}); 

router.get('/localcontent/:page', async(req, res) => {
    let perpage = 6;
    let page = req.params.page || 1;
    let localcontent, count;
    try {
        if(!req.query.keywords) {
            localcontent = await LocalContent.find({}).skip((perpage*page) - (perpage)).limit(perpage);
            count = await LocalContent.countDocuments();
        } else {
            let regex = new RegExp(escapeRegex(req.query.keywords), 'gi');
            localcontent = await LocalContent.find({ judul : regex }).skip((perpage*page) - (perpage)).limit(perpage);
            count = await LocalContent.find({ judul : regex }).countDocuments();
        }
        res.render('pages/pengaturan_localcontent', {
            title : "Pengaturan - Local Content",
            data : localcontent,
            current : page,
            count : count,
            pages : Math.ceil(count/perpage),
            keywords : req.query.keywords,
            messageUpdate : req.flash('messageUpdate'),
            updateError : req.flash('updateError'),
            Removed : req.flash('Removed')
        });
    }
    catch(e) {
        console.log("Error " + e);
    }
}); 

router.patch('/localcontent/:id', async(req, res) => {
    let id = req.params.id;
    try {
        const localcontent = await LocalContent.findByIdAndUpdate(id, { ...req.body } , { new : true});
        req.flash('messageUpdate', `Data Local Content berhasil di update`);
        res.redirect(`/user/pengaturan/localcontent?keywords=${encodeURIComponent(localcontent.judul)}`);
    } catch(e) {
        req.flash('updateError' , 'Gagal melakukan update : ' + e);
        res.redirect('/user/pengaturan/localcontent');
    }
});

router.delete('/delete-localcontent/:id', async(req, res) => {
    let id = req.params.id;
    try {
        const localcontent = await LocalContent.findByIdAndDelete(id);
        req.flash('Removed', `Local Content dengan Judul : ${localcontent.judul}`);
        res.redirect('/user/pengaturan/localcontent');
    } catch(e) {
        req.flash('updateError' , 'Gagal menghapus data : ' +e);
        res.redirect('/user/pengaturan/localcontent');
    }
});

module.exports = router;