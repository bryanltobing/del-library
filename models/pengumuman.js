const mongoose = require('mongoose');

const pengumumanSchema = mongoose.Schema({
    judul : {
        type : String,
        required : true,
        trim : true
    },
    author : {
        type : String,
        required : true,
        trim : true
    },
    konten : {
        type : String,
        required : true
    }
}, {
    timestamps : true
});

module.exports = mongoose.model('pengumuman', pengumumanSchema);