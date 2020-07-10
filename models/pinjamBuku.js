const mongoose = require('mongoose');

// models user
const User = require('../models/users');

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
    // status pinjam 0 menunggu 1 diterima 9 ditolak 5 completed 2 terlambat mengembalikan
    statusPinjam : {
        type : String,
        trim : true,
        default : "0"
    },
    tanggalPengembalian : {
        type : Date
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        trim : true,
        required : true
    }
}, {
    timestamps : true
});


pinjamBukuSchema.pre('save', async function(next) {
    const buku = this;  
    try {
        await User.findOneAndUpdate({_id : buku.owner} , { $inc : { jumlahPinjaman : 1 } });
        next();
    } catch(e) {
        console.log("error " + e);
    }
});

pinjamBukuSchema.pre('deleteOne', { document : true }, async function(next) {
    const buku = this;
    try {
        await User.findByIdAndUpdate({_id : buku.owner}, { $inc : { jumlahPinjaman : -1 }});
        next();
    } catch(e) {
        console.log("error " + e);
    }
});

module.exports = mongoose.model('pinjambuku', pinjamBukuSchema);