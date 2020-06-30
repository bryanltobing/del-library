const mongoose = require('mongoose');

const local_contentSchema = new mongoose.Schema({
    judul : {
        type : String,
        required : true,
        trim : true
    },
    subject : {
        type : String,
        required : true,
        trim : true
    },
    jenis : {
        type : String,
        required : true,
        trim : true
    },
    penulis : {
        type : String,
        required : true,
        trim : true
    },
    pembimbing : {
        type : String,
        required : true,
        trim : true,
    },
    tahun : {
        type : Number,
        required : true,
        trim : true
    },
    tingkat : {
        type : String,
        required : true,
        trim : true
    },
    status : {
        type : String,
        default : 0
    }
} , {
    timestamps : true
});

module.exports = mongoose.model('local_content', local_contentSchema);