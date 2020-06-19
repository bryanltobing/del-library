const express = require('express');
const router = express.Router();
const { auth, notAuth } = require('../middleware/auth');
const Cards = require('../models/card_request');
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
            errorAdded : req.flash('errorAdded')
        });
    } catch(e) {
        console.log("Error " + e);
    };
});

router.get('/request-card-list', auth, async (req, res) => {
    try {
        const card = await Cards.find({});
        card.forEach(function(c) {
            c.created = moment(c.createdAt).fromNow(false);
        });

        res.render('pages/requestcard_list', {
            title : "Request Card List",
            user : req.user,
            request : card
        });
    } catch(e) {
        console.log("error " + e);
    }
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

module.exports = router;