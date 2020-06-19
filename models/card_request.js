const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    fullname : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        required : true,
        unique : true
    },
    prodi : {
        type : String,
        trim : true,
        required : true
    },
    fakultas : {
        type : String,
        trim : true,
        required : true
    },
    nomorinduk : {
        type : String,
        trim : true,
        required : true
    },
    phoneNumber : {
        type : Number,
        trim : true,
        required : true
    },
    message : {
        type : String,
        trim : true,
        required : true
    },
    isApproved : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true
    },
}, {
    timestamps : true
});



const Card = mongoose.model('cards', cardSchema);

module.exports = Card;