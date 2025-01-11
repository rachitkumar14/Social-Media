
const mongoose = require('mongoose');
require('dotenv').config();

function connectedDataBase()
{
    mongoose.connect(process.env.db_url).then(()=>{
        console.log(`DataBase connected successfully`)
    }).catch((err)=>{
        console.log('Error in connected database',err)
    })
}

module.exports = connectedDataBase;
