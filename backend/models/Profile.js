const moongose = require('mongoose');

const profileSchema = new moongose.Schema({
    gender: {
        type: String,
        required: true,
        trim:true
    },
    dateOfBirth: {
        tpye:String
    },
    about: {
        type:String,
        trim:true
    },
    contactNumer:{
        type:Number,
        trim:true
    }
})

module.exports = moongose.model("Profile", profileSchema);