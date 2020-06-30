const express = require('express');
const router = express.Router();

// Models
const Book = require('../models/books');
const CD = require('../models/cd_dvd');
const Article = require('../models/article');
const LocalContent = require('../models/local_content');

router.get('/', async function(req, res) {
    const book = await Book.countDocuments();
    const cd = await CD.countDocuments();
    const article = await Article.countDocuments();
    const localContent = await LocalContent.countDocuments();
    const articleTerbaru = await Article.find({}).limit(1).sort({createdAt : 'desc'});
    res.render('pages/index' , {
        title : "OLIS ITDEL",
        data : {
            book : Number(book),
            cd : Number(cd),
            article : Number(article),
            localContent : Number(localContent)
        },
        terbaru : {
            articleterbaru : articleTerbaru[0]
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