
const mongoose = require('mongoose')

const postModel = mongoose.Schema({

    postImage:{
        type:String, 
    },
    postCaption:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    likes:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
      }
    ],
    comments:[
      {
       type:mongoose.Schema.Types.ObjectId,
       ref:"comment"
      }
    ],
    date:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model('post',postModel)