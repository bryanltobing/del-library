const express = require('express');
const router = express.Router();

const { auth, authRoleLibrarian } = require('../middleware/auth');
const Books = require('../models/books');

// function
const escapeRegex = require('../function/search');

router.get('/', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/pengaturan', {
        title : "Pengaturan"
    });
}); 

router.get('/buku', async (req, res) => {
    let perPage = 9;
    let page = 1;
    let book, count, regex;
    
    try {
        if(!req.query.keywords) {
            book = await Books.find({}).skip((perPage * page) - perPage).limit(perPage);
            count = await Books.countDocuments();
        } else {
            regex = new RegExp(escapeRegex(req.query.keywords), 'gi');
            book = await Books.find({ $or : [ { judul : regex }, { pengarang : regex } ]}).skip((perPage * page) - perPage).limit(perPage);
            count = await Books.find({ $or : [ { judul : regex }, { pengarang : regex } ]}).countDocuments();
        }
        res.render('pages/pengaturan_buku', {
            title : "Pengaturan Buku",
            data : book,
            current : page,
            count : count,
            pages : Math.ceil(count / perPage),
            keywords : req.query.keywords
        });
    } catch (e) {
        console.log("error " + e);
    }
});

router.get('/buku/:page', auth, authRoleLibrarian, async(req, res) => {
    let perPage = 9;
    let page = req.params.page || 1;

    try {
        const book = await Books.find({}).skip((perPage * page) - perPage).limit(perPage);
        if(book.length === 0) {
            throw new Error('Buku tidak ditemukan');
        }
        const count = await Books.countDocuments();
        res.render('pages/pengaturan_buku', {
            title : 'Book - List',
            data : book,
            current : page,
            count,
            pages : Math.ceil(count / perPage),
            bookMessage : req.flash('bookDetailError'),
            keywords : req.query.keywords
        });
    } catch(e) {
        console.log("Error " + e);
        req.flash('bookDetailError', "Buku tidak ditemukan")
        res.redirect('/pengaturan_buku');
    }
});




module.exports = router;
