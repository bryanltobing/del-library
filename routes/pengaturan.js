const express = require('express');
const router = express.Router();

const { auth, authRoleLibrarian } = require('../middleware/auth');
const Books = require('../models/books');

const sharp = require('sharp');


// function
const escapeRegex = require('../function/search');

router.get('/', auth, authRoleLibrarian, (req, res) => {
    res.render('pages/pengaturan', {
        title : "Pengaturan"
    });
}); 

router.get('/buku', auth, authRoleLibrarian, async (req, res) => {
    let perPage = 9;
    let page = 1;
    let book, count, regex;
    
    try {
        if(!req.query.keywords) {
            book = await Books.find({}).skip((perPage * page) - perPage).limit(perPage);
            count = await Books.countDocuments();
        } else {
            regex = new RegExp(escapeRegex(req.query.keywords), 'gi');
            book = await Books.find({ $or : [ { judul : regex }, { pengarang : regex } ]}).skip((perPage * page) - perPage).limit(perPage);
            count = await Books.find({ $or : [ { judul : regex }, { pengarang : regex } ]}).countDocuments();
        }
        res.render('pages/pengaturan_buku', {
            title : "Pengaturan Buku",
            data : book,
            current : page,
            count : count,
            pages : Math.ceil(count / perPage),
            keywords : req.query.keywords,
            updateBookError : req.flash('updateBookError')
        });
    } catch (e) {
        console.log("error " + e);
    }
});

router.get('/buku/:page', auth, authRoleLibrarian, async(req, res) => {
    let perPage = 9;
    let page = req.params.page || 1;

    try {
        const book = await Books.find({}).skip((perPage * page) - perPage).limit(perPage);
        if(book.length === 0) {
            throw new Error('Buku tidak ditemukan');
        }
        const count = await Books.countDocuments();
        res.render('pages/pengaturan_buku', {
            title : 'Book - List',
            data : book,
            current : page,
            count,
            pages : Math.ceil(count / perPage),
            bookMessage : req.flash('bookDetailError'),
            keywords : req.query.keywords
        });
    } catch(e) {
        console.log("Error " + e);
        req.flash('bookDetailError', "Buku tidak ditemukan")
        res.redirect('/pengaturan_buku');
    }
});

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

router.patch('/update-buku/:id', auth, authRoleLibrarian, upload.single('gambar'), async(req, res) => {
    const idBook = req.params.id;
    try {
        let book;
        if(req.file !== undefined) {
            book = await Books.findByIdAndUpdate(idBook, {
                ...req.body, 
                gambar : await sharp(req.file.buffer).webp().resize({ width : 260, height : 414}).toBuffer()}, 
                {
                    new : true
                }
            );
        } else {
            book = await Books.findByIdAndUpdate(idBook, { ...req.body }, { new : true });
        }
        req.flash('messageAddBook', 'Buku berhasil di update');
        res.redirect(`/book-detail/${book._id}`);
    } catch(e) {
        req.flash('updateBookError', `Update buku gagal Coba lagi ${e}`);
        res.redirect('/user/pengaturan/buku');
    }

});




module.exports = router;
