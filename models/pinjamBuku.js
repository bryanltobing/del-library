const mongoose = require('mongoose');

const pinjamBukuSchema = mongoose.Schema({
    namaPeminjam : {
        type : String,
        required : true,
        trim : true
    },
    nomorIndukPeminjam : {
        type : String,
        required : true,
        trim : true
    },
    prodiPeminjam : {
        type : String,
        required : true,
        trim : true
    },
    rolePeminjam : {
        type : String,
        required : true,
        trim : true
    },
    judulBuku : {
        type : String,
        required : true,
        trim : true
    },
    isbnBuku : {
        type : String,
        trim : true,
        required : true
    },
    pengarangBuku : {
        type : String,
        trim : true,
        required : true
    },
    gambarBuku : {
        type : String,
        trim : true,
        required : true
    }
}, {
    timestamps : true
});


module.exports = pinjamBukuSchema;