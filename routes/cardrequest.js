const express = require('express');
const router = express.Router();
const { auth, notAuth, authRoleLibrarian } = require('../middleware/auth');
const Cards = require('../models/card_request');
const User = require('../models/users');
const moment = require('moment-timezone');

router.get('/request-library-card', auth , async (req, res) => {

    try {
        await req.user.populate({
            path : 'card_requests',
        }).execPopulate();
        res.render('pages/requestcard', {
            title : "Request Card",
            user : req.user,
            request : req.user.card_requests,
            time : moment(req.user.card_requests.createdAt).tz('Asia/Jakarta').format('LLLL'),
            successAdded : req.flash('successAdded'),
            success : req.flash('success'),
            errorAdded : req.flash('errorAdded')
        });
    } catch(e) {
        console.log("Error " + e);
    };
});

router.post('/request-library-card', auth , async (req, res) => {
    const cards = new Cards({
        ...req.body,
        owner : req.user._id,
    });

    try {
        await cards.save();
        req.flash('successAdded', 'Data Successfully Added');
        res.redirect('/user/request-library-card');
    } catch (e) {
        req.flash('errorAdded', 'Data Failed Added');
    }
    
});

router.get('/request-card-list', auth, authRoleLibrarian, async (req, res) => {
    try {
        const card = await Cards.find({});
        card.forEach(function(c) {
            c.created = moment(c.createdAt).fromNow(false);
        });

        res.render('pages/requestcard_list', {
            title : "Request Card List",
            user : req.user,
            request : card,
            successUpdate : req.flash('successUpdate')
        });
    } catch(e) {
        console.log("error " + e);
    }
});

router.patch('/request-card-list/approved-process/:id', auth, authRoleLibrarian, async (req, res) => {
    const filter = req.params.id;
    try {
        const card = await Cards.findOneAndUpdate({ _id : filter }, {isApproved : true }, {
            new : true
        });
        await User.findOneAndUpdate({ _id : card.owner  }, { statusKeanggotaan : true })
        req.flash('successUpdate', 'Request Approved Succesfully');
        res.redirect('/user/request-card-list');
    } catch (e) {
        req.flash('errorUpdate', 'Request Approved Failed');
        res.redirect('/user/request-card-list');
    }
});



module.exports = router;