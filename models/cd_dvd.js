const mongoose = require('mongoose');
const { model } = require('./article');

const cd_dvdSchema = new mongoose.Schema({
    id_master : {
        type : String,
        required : true
    },
    judul  :{
        type : String,
        required : true,
        trim : true
    },
    sumber : {
        type : String,
        required : true
    },
    prodiPemilik : {
        type : String,
        required : true,
        trim : true
    },
    keterangan : {
        type : String,
        required : true
    },
    status : {
        type : Number,
        default : 0,
    },
    uploader : {
        type : String,
        required : true
    }
}, {
    timestamps : true
});

module.exports = mongoose.model('cd_dvd', cd_dvdSchema);