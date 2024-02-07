const mongoose = require('mongoose')
const Schema = mongoose.Schema

const journeyModel = new Schema({
    to : {
        type : String,
        required : true
    },
    leavingtime : {
        type : String,
        required : true
    },
    note : {
        type : String,
        required : true
    }
},{timestamps : true})

module.exports = mongoose.model('journey' , journeyModel)