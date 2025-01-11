
const mongoose = require('mongoose')

const userModel = mongoose.Schema({
     
    userName:{
        type:String,
       
    },
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    profilePic:{
        type:String,
        default:"/Image/default.png",

    },
    posts:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"post"
    }
    ]

})

module.exports = mongoose.model('user',userModel);