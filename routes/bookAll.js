const express = require('express');
const router = express.Router();

// Models
const Book = require('../models/books');

// function
const escapeRegex = require('../function/search');

router.get('/book-detail/:id', async(req, res) => {
    
    try {
        const book = await Book.findById(req.params.id);
        res.render('pages/bookdetail', {
            title : 'Book - Detail',
            data : book,
            message : req.flash('messageAddBook'),
        });
    } catch(e) {
        req.flash('bookDetailError' ,'Buku tidak ditemukan');
        res.redirect('/book-list');
    }

});

router.get('/book-list', async(req, res) => {
    var perPage = 9;
    var page = 1;
    try {
        if(!req.query.keywords) {
            const book = await Book.find({}).skip((perPage * page) - perPage).limit(perPage);
            const count = await Book.countDocuments();
            res.render('pages/booklist', {
                title : 'Book - List',
                data : book,
                current : page,
                count,
                pages : Math.ceil(count / perPage),
                bookMessage : req.flash('bookDetailError')
            });
        } else {
            const regex = new RegExp(escapeRegex(req.query.keywords), 'gi');
            // GET
            const book = await Book.find({
                $or: [
                    {
                        judul : regex
                    },
                    {
                        pengarang : regex
                    }
                ]
             }).skip((perPage * page) - perPage).limit(perPage);
             const count = book.length;
             res.render('pages/booklist', {
                 title : 'Book - List',
                 data : book,
                 current : page,
                 count,
                 pages : Math.ceil(count / perPage),
                 bookMessage : req.flash('bookDetailError')
             });
        }
        
        
    } catch(e) {
        console.log("Error " + e);
    }
});

router.get('/book-list/:page', async(req, res) => {
    var perPage = 9;
    var page = req.params.page || 1;

    try {
        const book = await Book.find({}).skip((perPage * page) - perPage).limit(perPage);
        if(book.length === 0) {
            throw new Error('Buku tidak ditemukan');
        }
        const count = await Book.countDocuments();
        res.render('pages/booklist', {
            title : 'Book - List',
            data : book,
            current : page,
            count,
            pages : Math.ceil(count / perPage),
            bookMessage : req.flash('bookDetailError')
        });
    } catch(e) {
        req.flash('bookDetailError', "Buku tidak ditemukan")
        res.redirect('/book-list');
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