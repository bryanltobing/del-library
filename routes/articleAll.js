const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// models
const Article = require('../models/article');

router.get('/article', async (req, res) => {
    try {
        const article = await Article.find({});
        article.forEach((a) => {
            a.tanggal = moment(a.createdAt).tz('Asia/Jakarta').locale('id').format('LL').split(' ');
            a.tanggalUpdate = moment(a.updatedAt).tz('Asia/Jakarta').locale('id').format('LLLL');
        });
        res.render('pages/article', {
            title : "Article",
            data : article,
            articleDetailError : req.flash('articleDetailError')
        });
    } catch (e) {
        console.log("error"  + e);
    }

});

router.get('/article-detail/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        article.tanggal = moment(article.createdAt).tz('Asia/Jakarta').locale('id').format('LL').split(' ');
        article.tanggalUpdate = moment(article.updatedAt).tz('Asia/Jakarta').locale('id').format('LLLL');
        
        res.render('pages/articledetail', {
            title : "Article - Detail",
            data : article,
            successArticle : req.flash('successArticle')
        });
    } catch(e) {
        req.flash('articleDetailError' ,'Artikel tidak ditemukan');
        res.redirect('/article');
    }
});

router.get('/getarticle-image/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if(!article || !article.gambar) {
            throw new Error();
        }
        res.set('Content-Type' , 'image/webp');
        res.send(article.gambar);
    } catch (e) {
        res.status(404).send(e);
    }
})

module.exports = router;