const mongoose = require('mongoose')
//College Placement System // Database connect

const connectDb=()=>{
    return mongoose.connect(process.env.local_url)
    .then(()=>{
        console.log("Connect Db")
    }).catch((error)=>{
        console.log(error)
    })
}

module.exports = connectDb