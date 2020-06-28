const express = require('express');
const router = express.Router();

// Models
const Book = require('../models/books');

router.get('/', async function(req, res) {
    const book = await Book.countDocuments();
    res.render('pages/index' , {
        title : "OLIS ITDEL",
        data : Number(book)
    });
});

router.get('/services', function(req, res) {
    res.render('pages/services' , {
        title : "Services - OLIS ITDEL",
        session : req.session.passport
    });
});


module.exports = router;