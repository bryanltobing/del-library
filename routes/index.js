const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// Models
const Book = require('../models/books');
const CD = require('../models/cd_dvd');
const Article = require('../models/article');
const LocalContent = require('../models/local_content');
const Pengumuman = require('../models/pengumuman');

// Function
const escapeRegex = require('../function/search');

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
        const bookCount = await Book.countDocuments();
        const cdCount = await CD.countDocuments();
        const articleCount = await Article.countDocuments();
        const localContentCount = await LocalContent.countDocuments();
        const articleTerbaru = await Article.find({}).limit(1).sort({createdAt : 'desc'});
        articleTerbaru.forEach((a) => {
            a.tanggal = moment(a.createdAt).tz('Asia/Jakarta').locale('id').format('LL').split(' ');
            a.tanggalUpdate = moment(a.updatedAt).tz('Asia/Jakarta').locale('id').format('LLLL');
        });
        if(req.query.catalog === "") {
            let regex = new RegExp(escapeRegex(flash), 'gi');
            // book
            const book = await Book.find({ $or : [ {judul : regex}, {pengarang : regex}, {deskripsi : regex} ]}).limit(3);
            const bookSearchCount = await (await Book.find({ $or : [ {judul : regex}, {pengarang : regex}, {deskripsi : regex} ]})).length;
            // cd
            const cd = await CD.find({$or : [ {judul : regex}, {keterangan : regex}, {sumber : regex} ]}).limit(5);
            const cdSearchCount = await (await CD.find({$or : [ {judul : regex}, {keterangan : regex}, {sumber : regex} ]})).length;
            // local content
            const localcontent = await LocalContent.find({$or : [ {judul : regex} , {subject : regex} ]}).limit(5);
            const localcontentSearchCount = await (await LocalContent.find({$or : [ {judul : regex} , {subject : regex} ]})).length;
            // article
            const article = await Article.find({$or : [ {judul : regex} , {category : regex}, {text : regex} ]}).limit(6);
            const articleSearchCount = await (await Article.find({$or : [ {judul : regex} , {category : regex}, {text : regex} ]})).length;
            article.forEach((a) => {
                a.tanggal = moment(a.createdAt).tz('Asia/Jakarta').locale('id').format('LL').split(' ');
                a.tanggalUpdate = moment(a.updatedAt).tz('Asia/Jakarta').locale('id').format('LLLL');
            });
            // pengumuman
            const pengumuman = await Pengumuman.find({ $or : [ {judul : regex}, {konten : regex}] }).limit(3);
            const pengumumanSearchCount = await (await Pengumuman.find({ $or : [ {judul : regex}, {konten : regex}] })).length;
            pengumuman.forEach((p) => {
                p.tanggal = moment(p.createdAt).tz('Asia/Jakarta').locale('id').format('LLLL').split(' ');
            });

            const totalCount = bookSearchCount + cdSearchCount + localcontentSearchCount + articleSearchCount + pengumumanSearchCount;


            return res.render('pages/fullsearch', {
                title : "Search : " + flash,
                search : {
                    book,
                    cd,
                    localcontent,
                    article,
                    pengumuman
                },  
                searchCount : {
                    totalCount,
                    bookSearchCount,
                    cdSearchCount,
                    localcontentSearchCount,
                    articleSearchCount,
                    pengumumanSearchCount
                },
                keywords : flash,
                data : {
                    book : Number(bookCount),
                    cd : Number(cdCount),
                    article : Number(articleCount),
                    localContent : Number(localContentCount)
                },
                terbaru : {
                    articleterbaru : articleTerbaru[0]
                }
            });

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

router.get('/search', (req, res) => {

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