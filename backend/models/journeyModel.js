const mongoose = require('mongoose')
const Schema = mongoose.Schema

const journeyModel = new Schema({
    userid : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    userage : {
        type : Number,
        required : true
    },
    usergender : {
        type : String,
        required : true
    },
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
    },
    peoplejoined :[{
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }],
    numberofpeoplejoined : {
        type : Number,
        required : true
    }
},{timestamps : true})

module.exports = mongoose.model('journey' , journeyModel)