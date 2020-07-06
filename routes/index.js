const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// Models
const Book = require('../models/books');
const CD = require('../models/cd_dvd');
const Article = require('../models/article');
const LocalContent = require('../models/local_content');
const Pengumuman = require('../models/pengumuman');

router.get('/', async function(req, res) {
    const book = await Book.countDocuments();
    const cd = await CD.countDocuments();
    const article = await Article.countDocuments();
    const localContent = await LocalContent.countDocuments();
    const articleTerbaru = await Article.find({}).limit(1).sort({createdAt : 'desc'});
    articleTerbaru.forEach((a) => {
        a.tanggal = moment(a.createdAt).tz('Asia/Jakarta').locale('id').format('LL').split(' ');
        a.tanggalUpdate = moment(a.updatedAt).tz('Asia/Jakarta').locale('id').format('LLLL');
    });
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

router.get('/search', async (req, res) => {
    let route;
    let flash = req.query.keywords;
    try {
        if(req.query.catalog === "") {
            route = "/";
        }
        if(req.query.catalog === "Book") {
            route = '/book-list';
        }
        if(req.query.catalog === "Local Content") {
            route = '/localcontent-list';
            return res.redirect(`${route}?keywords=${flash}&jenis=`);
        }
        if(req.query.catalog === "Artikel") {
            route = "/article";
        }
        if(req.query.catalog === "CDDVD") {
            route = "/cd_dvd-list";
        }
        if(req.query.catalog === "Pengumuman") {
            route = "/pengumuman-list";
        }
        res.redirect(`${route}?keywords=${flash}`);
    } catch(e) {
        console.log("Error " + e);
    }
});

router.get('/services', async function(req, res) {
    const book = await Book.countDocuments();
    const cd = await CD.countDocuments();
    const article = await Article.countDocuments();
    const localContent = await LocalContent.countDocuments();
    res.render('pages/services' , {
        title : "Services - OLIS ITDEL",
        count : {
            book,
            cd,
            article,
            localContent
        },
        session : req.session.passport
    });
});


module.exports = router;