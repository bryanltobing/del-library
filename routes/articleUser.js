const express = require('express');
const router = express.Router();

const multer = require('multer');
const sharp = require('sharp');

// middleware
const { auth, authRoleLibrarian } = require('../middleware/auth');

// models
const Article = require('../models/article');

router.get('/add-article', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/addarticle', {
        title : "Add Article",
        user : req.user
    });
});


const upload = multer({
    limits : 1024*1024*2,
    fileFilter(req, file, cb) {
        if(!file.originalname.toLowerCase().match(/\.jpg|jpeg|png/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true);
    }
});

router.post('/add-article', auth, authRoleLibrarian, upload.single('gambar'), async (req, res) => {
    try {
        if(req.file !== undefined) {
            const bufferArticle = await sharp(req.file.buffer).webp().resize({ width : 1170, height : 500}).toBuffer();
            const article = new Article({
                ...req.body,
                author : req.user.fullname,
                gambar : bufferArticle
            })
            await article.save();
            req.flash('successArticle', 'Article Berhasil dibuat');
            res.redirect(`/article-detail/${article._id}`);
        } else {
            const article = new Article({
                ...req.body,
                author : req.user.fullname,
            });
            await article.save();
            req.flash('successArticle', 'Article Berhasil dibuat');
            res.redirect(`/article-detail/${article._id}`);
        }
    } catch(e) {
        console.log("error" + e);
    }
}, (error, req, res, next) => {
    res.status(400).send({ message : error.message });
});

module.exports = router;