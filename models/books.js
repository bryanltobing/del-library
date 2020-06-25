const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    isbn : {
        type : String,
        trim : true,
        required : true
    },
    judul : {
        type : String,
        trim : true,
        required : true
    },
    pengarang : {
        type : String,
        trim : true,
        required : true
    },
    penerbit : {
        type : String,
        trim : true,
        required : true
    },
    bahasa : {
        type : String,
        trim : true,
        required : true
    },
    tahun : {
        type : String,
        trim : true,
        required : true
    },
    lokasi : {
        type : String,
        trim : true,
        required : true
    },
    deskripsi : {
        type : String,
        trim : true,
        required : true
    },
    gambar : {
        type : Buffer,
    }
});


const Books = mongoose.model('books', bookSchema);

module.exports = Books;