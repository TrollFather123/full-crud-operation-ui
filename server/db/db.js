const mongoose = require("mongoose")

const DB = process.env.DB

const server = mongoose.connect(DB).then(()=>{
    console.log('DB is connected')
})

module.exports = server