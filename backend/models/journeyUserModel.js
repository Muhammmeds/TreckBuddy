const mongoose = require('mongoose')

const Schema = mongoose.Schema

const journeyUserModel = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    age : {
        type : Number,
        required : true,
    },
    gender : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    // acceptedajourney : {
    //     type : Boolean,
    //     required : true
    // }
},{timestamps : true})

module.exports = mongoose.model('journeyUser' , journeyUserModel)