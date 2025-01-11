const jwt = require('jsonwebtoken')
require('dotenv').config();
function isLogged(req,res,next)
{   

       if(!req.cookies.token)
       { 
       // console.log(req.cookies.token)
         return res.status(400).json({
               message:"invalid token"
               
          })
       }
      
        const data= jwt.verify(req.cookies.token,process.env.Secret_Key)
        req.user = data;
        next();
    
           
}

module.exports = isLogged;