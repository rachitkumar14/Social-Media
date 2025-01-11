
const mongoose = require('mongoose');

const commentModel = mongoose.Schema({

    commentData:{
        type:String,
    },
    posts:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }

})

module.exports = mongoose.model('comment',commentModel)