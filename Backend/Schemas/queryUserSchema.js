
const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
    },
    city:{
        type:String,
    },
    query:{
        type:String
    }

})

module.exports = mongoose.model('query',querySchema);