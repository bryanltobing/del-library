const mongoose = require('mongoose');

const pinjamBukuSchema = mongoose.Schema({
    idBuku : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true
    },
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
    emailPeminjam : {
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
    gambar : {
        type : Buffer
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        trim : true,
        required : true
    }
}, {
    timestamps : true
});


module.exports = mongoose.model('pinjambuku', pinjamBukuSchema);