const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    category : {
        type : String,
        required : true,
        trim : true
    },
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
    text : {
        type : String,
        required : true,
    },
    likes : {
        type : Number,
    },
    comment : {
        type : String,
    },  
    gambar : {
        type : Buffer
    },
    tags : {
        type : []
    }

} , {
    timestamps : true
});

module.exports = mongoose.model('article', articleSchema);