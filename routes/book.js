const express = require('express');
const router = express.Router();
const { auth, notAuth, authRoleLibrarian } = require('../middleware/auth');
const sharp = require('sharp');
const   moment = require('moment-timezone');

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


router.get('/add-book', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/addbook', {
        title : "Add Book",
        user : req.user
    });
});

router.post('/add-book', auth, authRoleLibrarian, upload.single('gambar') , async (req, res) => {
    const sharpBuffer = await sharp(req.file.buffer).webp().resize({ width : 260, height : 414}).toBuffer();
    const book = new Book({
        ...req.body,
        gambar : sharpBuffer
    });


    await book.save();
    req.flash('messageAddBook', 'Buku Berhasil Ditambahkan');
    res.send(book);

}, (error, req, res, next) => {
    res.status(400).send({error : error.message});
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

module.exports = router;