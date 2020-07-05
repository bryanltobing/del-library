const express = require('express');
const router = express.Router();

const { auth, authRoleLibrarian } = require('../middleware/auth');

// models
const Article = require('../models/article');
const Pengumuman = require('../models/pengumuman');

const sharp = require('sharp');


// function
const escapeRegex = require('../function/search');

router.get('/', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/pengaturan', {
        title : "Pengaturan"
    });
}); 

// File uploads
const multer = require('multer');
const upload = multer({
    limits : 1024*1024*2,
    fileFilter(req, file, cb) {
        if(!file.originalname.toLowerCase().match(/\.jpg|jpeg|png/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true);
    }
});

// -------------- ARTIKEL -------------- //
router.patch('/update-article/:id', auth, authRoleLibrarian, upload.single('gambar'), async (req, res) => {
    const idArticle = req.params.id;
    let article;
    try {
        if(req.file !== undefined) {
            const bufferArticle = await sharp(req.file.buffer).webp().resize({ width : 1170, height : 500}).toBuffer();
            article = await Article.findByIdAndUpdate(idArticle, { ...req.body , gambar : bufferArticle }, {new : true});
        } else {
            article = await Article.findByIdAndUpdate(idArticle, { ...req.body }, {new : true});
        }
        req.flash('updateArticle', `Artikel: ${article.judul} Berhasil di Update`);
        res.redirect(`/article-detail/${article._id}`);
    } catch(e) {
        req.flash('error', `Artikel gagal di Update : ${e}`);
        res.redirect(`/article-detail/${article._id}`);
    }
});

router.delete('/delete-article/:id', auth, authRoleLibrarian, async(req, res) => {
    const idArticle = req.params.id;
    let article;
    try {
        article = await Article.findByIdAndDelete(idArticle);
        req.flash('articleDelete', 'Artikel Berhasil Dihapus');
        res.redirect('/article');
    } catch(e) {
        req.flash('error', 'Artikel Gagal Dihapus');
        res.redirect(`/article-detail/${article._id}`)
    }
});



// ------------------------ PENGUMUMAN ----------------------------- //
router.patch('/update-pengumuman/:id', auth, authRoleLibrarian, async(req, res) => {
    const idPengumuman = req.params.id;
    try {
        const pengumuman = await Pengumuman.findByIdAndUpdate(idPengumuman, { ...req.body }, {new : true});
        req.flash('messageAddPengumuman', 'Pengumuman Berhasil di Update');
        res.redirect(`/pengumuman-detail${pengumuman._id}`);
    } catch(e) {
        req.flash('error', 'Pengumuman Gagal di update : ' + e);
        res.redirect(`/pengumuman-list`);
    }
});

router.delete('/delete-pengumuman/:id', auth, authRoleLibrarian, async(req, res) => {
    const idPengumuman = req.params.id;
    try {

    } catch(e) {
        
    }
});


module.exports = router;
