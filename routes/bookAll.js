const express = require('express');
const router = express.Router();

// Models
const Book = require('../models/books');

router.get('/book-detail/:id', async(req, res) => {
    
    try {
        const book = await Book.findById(req.params.id);
        res.render('pages/bookdetail', {
            title : 'Book - Detail',
            data : book,
            message : req.flash('messageAddBook')
        });
    } catch(e) {
        console.log("Error " + e);
    }

});

router.get('/book-list', async(req, res) => {
    var perPage = 9;
    var page = 1;
    try {
        const book = await Book.find({}).skip((perPage * page) - perPage).limit(perPage);
        const count = await Book.countDocuments();
        res.render('pages/booklist', {
            title : 'Book - List',
            data : book,
            current : page,
            pages : Math.ceil(count / perPage)
        });
    } catch(e) {
        console.log("Error " + e);
    }
});

router.get('/book-list/:page', async(req, res) => {
    var perPage = 9;
    var page = req.params.page || 1;
    try {
        const book = await Book.find({}).skip((perPage * page) - perPage).limit(perPage);
        const count = await Book.countDocuments();
        res.render('pages/booklist', {
            title : 'Book - List',
            data : book,
            current : page,
            pages : Math.ceil(count / perPage)
        });
    } catch(e) {
        console.log("Error " + e);
    }
});

router.get('/getbook-image/:id', async(req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if(!book || !book.gambar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/webp');
        res.send(book.gambar);
    } catch(e) {
        res.status(404).send();
    }
});



module.exports = router;