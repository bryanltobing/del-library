const express = require('express');
const router = express.Router();
const { auth, notAuth, authRoleLibrarian } = require('../middleware/auth');
const sharp = require('sharp');
const moment = require('moment-timezone');

// Models
const Book = require('../models/books');

// File uploads
const multer = require('multer');
const upload = multer({
    limits : {
        fileSize : 1024*1024*2
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.toLowerCase().match(/\.jpg|jpeg|png/)){
            return cb(new Error('Please upload an image')) ;
        }

        cb(undefined, true);
    }
});

// ------ AUTH LIBRARIAN ROLE ----------- //
router.get('/add-book', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/addbook', {
        title : "Add Book",
        user : req.user
    });
});

router.post('/add-book', auth, authRoleLibrarian, upload.single('gambar') , async (req, res) => {
    if(req.file !== undefined) {
        const sharpBuffer = await sharp(req.file.buffer).webp().resize({ width : 260, height : 414}).toBuffer();
        const book = new Book({
            ...req.body,
            gambar : sharpBuffer
        });
        await book.save();
        req.flash('messageAddBook', 'Buku Berhasil Ditambahkan');
        res.redirect(`/book-detail/${book._id}`);
    } else {
        const book = new Book({
            ...req.body,
        });
        await book.save();
        req.flash('messageAddBook', 'Buku Berhasil Ditambahkan');
        res.redirect(`/book-detail/${book._id}`);
    }

}, (error, req, res, next) => {
    res.status(400).send({error : error.message});
});



module.exports = router;