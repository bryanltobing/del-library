const express = require('express');
const router = express.Router();

// Models
const Book = require('../models/books');

// Middleware
const pagination = require('../middleware/pagination');

router.get('/book-detail/:id', async(req, res) => {
    
    try {
        const book = await Book.findById(req.params.id);
        console.log(book);
        res.render('pages/bookdetail', {
            title : 'Book - Detail',
            data : book
        });
    } catch(e) {
        console.log("Error " + e);
    }

});

router.get('/book-list', async(req, res) => {
    res.render('pages/booklist', {
        title : 'Book - List'
    });
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

router.get('/list-book', pagination(Book) , (req, res) => {
    res.send(res.paginatedResults);
});


module.exports = router;