const express = require('express');
const router = express.Router();

const { auth, authRoleLibrarian } = require('../middleware/auth');
const Cd_Dvd = require('../models/cd_dvd');

// function
const escapeRegex = require('../function/search');

router.get('/cd-dvd', auth, authRoleLibrarian, async (req, res) => {
    let perPage = 9;
    let page = 1;
    let cd_dvd, count, regex;
    
    try {
        if(!req.query.keywords) {
            cd_dvd = await Cd_Dvd.find({}).skip((perPage * page) - perPage).limit(perPage);
            count = await Cd_Dvd.countDocuments();
        } else {
            regex = new RegExp(escapeRegex(req.query.keywords), 'gi');
            cd_dvd = await Cd_Dvd.find({ $or : [ { judul : regex }, { sumber : regex } ]}).skip((perPage * page) - perPage).limit(perPage);
            count = await Cd_Dvd.find({ $or : [ { judul : regex }, { sumber : regex } ]}).countDocuments();
        }
        res.render('pages/pengaturan_cd_dvd', {
            title : "Pengaturan CD DVD",
            data : cd_dvd,
            current : page,
            count : count,
            pages : Math.ceil(count / perPage),
            keywords : req.query.keywords,
            messageUpdate : req.flash('messageUpdate'),
            updateError : req.flash('updateError'),
            Removed : req.flash('Removed')
        });
    } catch (e) {
        console.log("error " + e);
    }
});

router.get('/cd-dvd/:page', auth, authRoleLibrarian, async(req, res) => {
    let perPage = 9;
    let page = req.params.page || 1;

    try {
        const cd_dvd = await Cd_Dvd.find({}).skip((perPage * page) - perPage).limit(perPage);
        if(cd_dvd.length === 0) {
            throw new Error('CD / DVD tidak ditemukan');
        }
        const count = await Cd_Dvd.countDocuments();
        res.render('pages/pengaturan_cd_dvd', {
            title : 'CD/DVD - List',
            data : cd_dvd,
            current : page,
            count,
            pages : Math.ceil(count / perPage),
            Message : req.flash('DetailError'),
            keywords : req.query.keywords,
            messageUpdate : req.flash('messageUpdate'),
            updateError : req.flash('updateError'),
            Removed : req.flash('Removed')
        });
    } catch(e) {
        console.log("Error " + e);
        req.flash('DetailError', "CD dvd tidak ditemukan")
        res.redirect('/pengaturan_cd_dvd');
    }
});

router.patch('/update-dvd/:id', auth, authRoleLibrarian, async(req, res) => {
    const idCD = req.params.id;
    try {
        const cd_dvd = await Cd_Dvd.findByIdAndUpdate(idCD, { ...req.body } , {
            new : true
        });
        req.flash('messageUpdate', 'Update CD Berhasil');
        res.redirect(`/user/pengaturan/cd-dvd?keywords=${encodeURIComponent(cd_dvd.judul)}`);
    } catch(e) {
        console.log("ERror " + e);
    }
});

router.delete('/delete-dvd/:id', auth, authRoleLibrarian, async(req, res) => {
    const idCD = req.params.id;
    try {
        const cd_dvd = await Cd_Dvd.findByIdAndDelete(idCD);
        req.flash('Removed', `Data CD ${cd_dvd.judul} berhasil di hapus`);
        res.redirect('/user/pengaturan/cd-dvd');
    } catch(e) {
        console.log("Error " + e);
    }
});



module.exports = router;