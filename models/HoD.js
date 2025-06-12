const mongoose = require('mongoose');

const HodSchema =mongoose.Schema({
    name:{
        type :String,
        required: true,
    },
    email:{
        type :String,
        required: true,
    },
    password:{
        type :String,
        required: true,
    },
    phone:{
        type :String,
        required: true,
    },
    gender:{
        type :String,
        required: true,
    },
    department:{
        type :String,
        required: true,
    },
    image:{
        public_id:{type:String},
        url:{type:String},
    },
    role:{
        type:String,
        default:"hod"
        
    },
    

})
const HodModel =mongoose.model('hod',HodSchema)

module.exports =HodModel