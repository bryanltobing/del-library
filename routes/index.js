const express = require('express');
const router = express.Router();

// Models
const Book = require('../models/books');
const CD = require('../models/cd_dvd');
const Article = require('../models/article');

router.get('/', async function(req, res) {
    const book = await Book.countDocuments();
    const cd = await CD.countDocuments();
    const article = await Article.countDocuments();
    res.render('pages/index' , {
        title : "OLIS ITDEL",
        data : {
            book : Number(book),
            cd : Number(cd),
            article : Number(article)
        }
    });
});

router.get('/services', function(req, res) {
    res.render('pages/services' , {
        title : "Services - OLIS ITDEL",
        session : req.session.passport
    });
});


module.exports = router;